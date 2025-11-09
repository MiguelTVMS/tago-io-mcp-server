import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type { Express } from 'express';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import {
  SERVER_INFO,
  createClient,
  createExpressApp,
  registerTools,
  setupHealthCheck,
  setupNgrokTunnel,
  startExpressServer,
} from './http-common.js';

/**
 * Start the MCP server using HTTP with SSE transport (MCP 2024-11-05 spec).
 * This mode uses Server-Sent Events for server-to-client communication
 * and HTTP POST for client-to-server communication.
 *
 * Security features:
 * - DNS rebinding protection via origin validation
 * - Network bind address control (defaults to 127.0.0.1)
 * - Optional ngrok tunnel for public access
 */
export async function startSseServer(): Promise<void> {
  try {
    logger.debug('Starting MCP server with SSE transport');

    // Create and validate TagoIO client
    const resources = await createClient();

    // Create Express app
    const app: Express = createExpressApp();

    // Setup health check endpoint
    setupHealthCheck(app);

    // Create MCP server instance
    const mcpServer = new McpServer(SERVER_INFO, {
      capabilities: {
        logging: {},
      },
    });

    // Register all tools
    await registerTools(mcpServer, resources);

    // Map to store transports by session ID
    const transports = new Map<string, SSEServerTransport>();

    // Handle GET requests for SSE stream establishment
    app.get(config.MCP_HTTP_PATH, (_req, res) => {
      logger.debug('SSE connection request received');

      // Create SSE transport with security options
      const transport = new SSEServerTransport(config.MCP_HTTP_PATH, res, {
        allowedOrigins: config.MCP_HTTP_ALLOWED_ORIGINS,
        enableDnsRebindingProtection: true,
      });

      // Store transport by session ID
      transports.set(transport.sessionId, transport);
      logger.debug(`New SSE session created: ${transport.sessionId}`);

      // Handle transport errors
      transport.onerror = (error) => {
        logger.error(`SSE transport error for session ${transport.sessionId}`, error);
      };

      // Handle transport close
      transport.onclose = () => {
        logger.debug(`SSE session closed: ${transport.sessionId}`);
        transports.delete(transport.sessionId);
      };

      // Start the SSE stream
      transport
        .start()
        .then(() => {
          logger.debug(`SSE stream started for session ${transport.sessionId}`);
          // Connect MCP server to transport
          return mcpServer.connect(transport);
        })
        .catch((error) => {
          logger.error(`Failed to start SSE stream for session ${transport.sessionId}`, error);
          transports.delete(transport.sessionId);
        });
    });

    // Handle POST requests for client messages
    app.post(config.MCP_HTTP_PATH, async (req, res) => {
      const sessionId = req.body?.sessionId;

      if (!sessionId) {
        logger.warn('POST request without session ID');
        res.status(400).json({ error: 'Session ID required' });
        return;
      }

      const transport = transports.get(sessionId);

      if (!transport) {
        logger.warn(`POST request for unknown session: ${sessionId}`);
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      try {
        await transport.handlePostMessage(req, res, req.body);
      } catch (error) {
        logger.error(
          `Error handling POST message for session ${sessionId}`,
          error instanceof Error ? error : undefined
        );
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    });

    // Start the HTTP server
    await startExpressServer(app);

    // Setup ngrok tunnel if enabled
    const ngrokUrl = await setupNgrokTunnel(config.MCP_HTTP_PORT);
    if (ngrokUrl) {
      logger.info(`Use this URL for remote access: ${ngrokUrl}${config.MCP_HTTP_PATH}`);
    }

    logger.info('SSE MCP server started successfully');
    logger.info('Waiting for client connections...');
  } catch (error) {
    logger.error('Failed to start SSE MCP server', error instanceof Error ? error : undefined);
    process.exit(1);
  }
}

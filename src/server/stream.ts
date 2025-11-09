import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
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
} from './http.js';

/**
 * Start the MCP server using Streamable HTTP transport (MCP 2025-06-18 spec).
 * This mode uses SSE streams for bidirectional communication over HTTP.
 *
 * Supports both stateful and stateless modes based on MCP_SERVER_STATEFUL config.
 *
 * Security features:
 * - DNS rebinding protection via origin validation
 * - Network bind address control (defaults to 127.0.0.1)
 * - Optional ngrok tunnel for public access
 */
export async function startStreamableHttpServer(): Promise<void> {
  try {
    logger.debug('Starting MCP server with Streamable HTTP transport');
    logger.debug(`Stateful mode: ${config.MCP_SERVER_STATEFUL}`);

    // Create and validate TagoIO client
    const resources = await createClient();

    // Create Express app
    const app: Express = createExpressApp();

    // Setup health check endpoint
    setupHealthCheck(app);

    // Map to store MCP server instances by session ID (for stateful mode)
    const mcpServers = new Map<string, McpServer>();
    const transports = new Map<string, StreamableHTTPServerTransport>();

    /**
     * Get or create MCP server instance for a session
     */
    const getMcpServer = async (sessionId?: string): Promise<McpServer> => {
      if (!config.MCP_SERVER_STATEFUL || !sessionId) {
        // In stateless mode, create a new server for each request
        const server = new McpServer(SERVER_INFO, {
          capabilities: {
            logging: {},
          },
        });
        await registerTools(server, resources);
        return server;
      }

      // In stateful mode, reuse existing server or create new one
      let server = mcpServers.get(sessionId);
      if (!server) {
        server = new McpServer(SERVER_INFO, {
          capabilities: {
            logging: {},
          },
        });
        await registerTools(server, resources);
        mcpServers.set(sessionId, server);
        logger.debug(`Created new MCP server for session: ${sessionId}`);
      }
      return server;
    };

    /**
     * Handle all HTTP requests (GET, POST, DELETE) for MCP endpoint
     */
    app.all(config.MCP_HTTP_PATH, async (req, res) => {
      try {
        // Create transport with appropriate options
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: config.MCP_SERVER_STATEFUL ? () => randomUUID() : undefined,
          allowedOrigins: config.MCP_HTTP_ALLOWED_ORIGINS,
          enableDnsRebindingProtection: true,
          onsessioninitialized: async (sessionId) => {
            logger.debug(`Session initialized: ${sessionId}`);
            transports.set(sessionId, transport);
          },
          onsessionclosed: async (sessionId) => {
            logger.debug(`Session closed: ${sessionId}`);
            transports.delete(sessionId);
            mcpServers.delete(sessionId);
          },
        });

        // Handle transport errors
        transport.onerror = (error) => {
          logger.error('Streamable HTTP transport error', error);
        };

        // Handle transport close
        transport.onclose = () => {
          logger.debug('Streamable HTTP transport closed');
        };

        // Get or create MCP server
        const mcpServer = await getMcpServer(transport.sessionId);

        // Connect MCP server to transport
        await mcpServer.connect(transport);

        // Handle the HTTP request
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        logger.error(
          'Error handling Streamable HTTP request',
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

    logger.info('Streamable HTTP MCP server started successfully');
    logger.info('Waiting for client connections...');
  } catch (error) {
    logger.error(
      'Failed to start Streamable HTTP MCP server',
      error instanceof Error ? error : undefined
    );
    process.exit(1);
  }
}

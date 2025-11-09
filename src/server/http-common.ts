import ngrok from '@ngrok/ngrok';
import type { Express } from 'express';
import express from 'express';
import { config } from '../config.js';
import { createClient } from '../tagoClient/index.js';
import { logger } from '../utils/logger.js';
import { SERVER_INFO, registerTools } from './common.js';

/**
 * Common HTTP server utilities shared between SSE and Streamable HTTP transports.
 */

/**
 * Creates and configures an Express application with CORS and JSON parsing
 */
export function createExpressApp(): Express {
  const app = express();

  // Enable CORS if configured
  if (config.MCP_HTTP_ALLOW_CORS) {
    app.use((req, res, next) => {
      const origin = req.headers.origin;

      // Allow requests from allowed origins
      if (origin && config.MCP_HTTP_ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
      }

      next();
    });
  }

  // Parse JSON bodies
  app.use(express.json());

  return app;
}

/**
 * Sets up health check endpoint if configured
 */
export function setupHealthCheck(app: Express): void {
  if (config.MCP_HTTP_ENABLE_HEALTHCHECK) {
    app.get(config.MCP_HTTP_HEALTHCHECK_PATH, (_req, res) => {
      res.status(200).json({
        status: 'healthy',
        transport: config.MCP_HTTP_TRANSPORT,
        path: config.MCP_HTTP_PATH,
      });
    });
    logger.debug(`Health check endpoint enabled at ${config.MCP_HTTP_HEALTHCHECK_PATH}`);
  }
}

/**
 * Starts the Express server on the configured bind address and port
 * @param app - Express application
 * @returns Promise that resolves when server is listening
 */
export async function startExpressServer(app: Express): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(config.MCP_HTTP_PORT, config.MCP_HTTP_BIND_ADDR, () => {
      logger.info(
        `HTTP server (${config.MCP_HTTP_TRANSPORT} transport) listening on ${config.MCP_HTTP_BIND_ADDR}:${config.MCP_HTTP_PORT}`
      );
      logger.info(`MCP endpoint: ${config.MCP_HTTP_PATH}`);
      resolve();
    });

    server.on('error', (error) => {
      logger.error('Failed to start HTTP server', error);
      reject(error);
    });
  });
}

/**
 * Sets up ngrok tunnel if enabled
 * @param port - Port to expose
 * @returns Promise resolving to ngrok URL if enabled, undefined otherwise
 */
export async function setupNgrokTunnel(port: number): Promise<string | undefined> {
  if (!config.MCP_HTTP_NGROK_ENABLED) {
    return undefined;
  }

  if (!config.MCP_HTTP_NGROK_AUTH_TOKEN) {
    throw new Error('MCP_HTTP_NGROK_AUTH_TOKEN is required when MCP_HTTP_NGROK_ENABLED is true');
  }

  try {
    logger.info('Starting ngrok tunnel...');

    const listener = await ngrok.forward({
      addr: port,
      authtoken: config.MCP_HTTP_NGROK_AUTH_TOKEN,
    });

    const url = listener.url();
    if (!url) {
      throw new Error('Failed to get ngrok URL');
    }
    logger.info(`ngrok tunnel established: ${url}`);
    logger.info(`Public MCP endpoint: ${url}${config.MCP_HTTP_PATH}`);

    return url;
  } catch (error) {
    logger.error('Failed to start ngrok tunnel', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Export shared resources and server configuration
 */
export { SERVER_INFO, registerTools, createClient };

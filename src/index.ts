#!/usr/bin/env node

import { config } from './config.js';
import { logger } from './utils/logger.js';

// Enable MCP logging in development mode
if (config.NODE_ENV === 'development') {
  void import('mcps-logger/console');
}

/**
 * Main entry point for the MCP server.
 * Routes to the appropriate server implementation based on configuration.
 */
async function main(): Promise<void> {
  try {
    logger.debug('Starting MCP server');
    logger.debug(`Mode: ${config.MCP_SERVER_USE_HTTP ? 'HTTP' : 'stdio'}`);

    if (config.MCP_SERVER_USE_HTTP) {
      // Start HTTP/SSE server
      const { startHttpServer } = await import('./server/http.js');
      await startHttpServer();
    } else {
      // Start stdio server (default)
      const { startStdioServer } = await import('./server/stdio.js');
      await startStdioServer();
    }
  } catch (error) {
    logger.error('Failed to start MCP server', error instanceof Error ? error : undefined);
    process.exit(1);
  }
}

void main();

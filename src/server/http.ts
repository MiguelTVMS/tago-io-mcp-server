import { config } from '../config.js';
import { logger } from '../utils/logger.js';

/**
 * Start the MCP server using HTTP transport.
 * Routes to the appropriate transport implementation based on configuration.
 *
 * Supported transports:
 * - SSE (Server-Sent Events): MCP 2024-11-05 specification
 * - Stream (Streamable HTTP): MCP 2025-06-18 specification
 */
export async function startHttpServer(): Promise<void> {
  try {
    logger.info(`Starting HTTP server with ${config.MCP_HTTP_TRANSPORT} transport`);

    if (config.MCP_HTTP_TRANSPORT === 'sse') {
      // Use SSE transport (MCP 2024-11-05)
      const { startSseServer } = await import('./sse.js');
      await startSseServer();
    } else {
      // Use Streamable HTTP transport (MCP 2025-06-18)
      const { startStreamableHttpServer } = await import('./stream.js');
      await startStreamableHttpServer();
    }
  } catch (error) {
    logger.error('Failed to start HTTP MCP server', error instanceof Error ? error : undefined);
    process.exit(1);
  }
}

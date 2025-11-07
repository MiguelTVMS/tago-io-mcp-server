import { config } from '../config.js';
import { logger } from '../utils/logger.js';

/**
 * Start the MCP server using HTTP/SSE transport.
 * This mode allows the server to be accessed via HTTP requests.
 * 
 * NOTE: HTTP server implementation is pending.
 * The following features need to be implemented:
 * 1. Handle authentication per request using authenticateClient()
 * 2. Create MCP server instances (stateful or stateless based on config)
 * 3. Use SSEServerTransport for communication
 * 4. Handle CORS, health checks, and other HTTP concerns
 * 5. Install express and @types/express dependencies
 */
export async function startHttpServer(): Promise<void> {
    try {
        logger.info('HTTP server mode is not yet implemented');
        logger.info(`Would start HTTP server on ${config.MCP_HTTP_HOST}:${config.MCP_HTTP_PORT}`);
        logger.error('Please use stdio mode (set MCP_SERVER_USE_HTTP=false) until HTTP implementation is complete');
        process.exit(1);
    } catch (error) {
        logger.error('Failed to start HTTP MCP server', error instanceof Error ? error : undefined);
        process.exit(1);
    }
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createClient } from '../tagoClient/index.js';
import { logger } from '../utils/logger.js';
import { SERVER_INFO, registerTools } from './common.js';

/**
 * Start the MCP server using stdio transport.
 * This is the default mode for MCP servers when running as a subprocess.
 */
export async function startStdioServer(): Promise<void> {
  try {
    logger.debug('Starting MCP server in stdio mode');

    // Create and validate TagoIO client
    const resources = await createClient();

    // Create MCP server
    const mcpServer = new McpServer(SERVER_INFO);

    // Register all tools
    await registerTools(mcpServer, resources);

    // Create stdio transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await mcpServer.connect(transport);

    logger.debug('MCP server started successfully with stdio transport');
    logger.debug('Tools registered and ready to receive requests');
  } catch (error) {
    logger.error('Failed to start stdio MCP server', error instanceof Error ? error : undefined);
    process.exit(1);
  }
}

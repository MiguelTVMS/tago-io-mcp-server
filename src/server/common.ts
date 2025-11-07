import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

/**
 * Common server utilities and configuration.
 */

/**
 * MCP Server metadata configuration.
 */
export const SERVER_INFO = {
  name: 'middleware-mcp-tagoio',
  version: '1.0.0',
} as const;

/**
 * Register all MCP tools with the server.
 * This function is shared between stdio and HTTP server implementations.
 *
 * @param server - MCP server instance
 * @param resources - TagoIO Resources instance
 */
export async function registerTools(server: McpServer, resources: Resources): Promise<void> {
  // Import tool registration dynamically to avoid circular dependencies
  const { handlerTools } = await import('../tools/index.js');
  await handlerTools(server, resources);
}

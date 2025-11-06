import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { entityTools } from './tools';

/**
 * @description Handler for entities tools to register tools in the MCP server.
 */
function handlerEntitiesTools(server: McpServer, resources: Resources) {
  for (const toolConfig of entityTools) {
    server.tool(
      toolConfig.name,
      toolConfig.description,
      toolConfig.parameters,
      { title: toolConfig.title },
      async (params) => {
        const result = await toolConfig.tool(resources, params);
        return { content: [{ type: 'text', text: result }] };
      }
    );
  }
}

export { handlerEntitiesTools };

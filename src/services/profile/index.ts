import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { profileMetricsTools } from './tools';

/**
 * @description Handler for profile metrics tools to register tools in the MCP server.
 */
function handlerProfileMetricsTools(server: McpServer, resources: Resources) {
  for (const toolConfig of profileMetricsTools) {
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

export { handlerProfileMetricsTools };

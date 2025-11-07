import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { handlerActionsTools } from './tools/actions.js';
import { handlerAnalysesTools } from './tools/analysis/index.js';
import { handlerDevicesTools } from './tools/devices/index.js';
import { handlerDocumentationTools } from './tools/documentation/index.js';
import { handlerEntitiesTools } from './tools/entities/index.js';
import { handlerIntegrationTools } from './tools/integration/index.js';
import { handlerProfileMetricsTools } from './tools/profile/index.js';
import { handlerUsersTools } from './tools/run-users/index.js';

/**
 * @description Register tools for the MCP server.
 */
async function handlerTools(server: McpServer, resources: Resources) {
  // Tools for TagoIO actions
  handlerActionsTools(server, resources);
  // Tools for TagoIO analyses
  handlerAnalysesTools(server, resources);
  // Tools for TagoIO devices
  handlerDevicesTools(server, resources);
  // Tools for TagoIO entities
  handlerEntitiesTools(server, resources);
  // Tools for TagoIO users
  handlerUsersTools(server, resources);
  // Tools for TagoIO profile metrics
  handlerProfileMetricsTools(server, resources);
  // Tools for TagoIO integration
  handlerIntegrationTools(server, resources);
  // Tools for TagoIO documentation
  handlerDocumentationTools(server, resources);
}

export { handlerTools };

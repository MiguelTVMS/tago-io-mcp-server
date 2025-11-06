import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { handlerActionsTools } from './services/actions/index';
import { handlerAnalysesTools } from './services/analysis/index';
import { handlerDevicesTools } from './services/devices/index';
import { handlerDocumentationTools } from './services/documentation/index';
import { handlerEntitiesTools } from './services/entities/index';
import { handlerIntegrationTools } from './services/integration/index';
import { handlerProfileMetricsTools } from './services/profile/index';
import { handlerUsersTools } from './services/run-users/index';

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

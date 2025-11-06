/* eslint-disable @typescript-eslint/require-await */
import { Resources } from '@tago-io/sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { handlerDevicesTools } from './services/devices/index';
import { handlerActionsTools } from './services/actions/index';
import { handlerUsersTools } from './services/run-users/index';
import { handlerEntitiesTools } from './services/entities/index';
import { handlerAnalysesTools } from './services/analysis/index';
import { handlerProfileMetricsTools } from './services/profile/index';
import { handlerIntegrationTools } from './services/integration/index';
import { handlerDocumentationTools } from './services/documentation/index';

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

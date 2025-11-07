import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { handlerActionsTools } from './actionOperations.js';
import { handlerAnalysesTools } from './analysisLookup.js';
import { handlerAnalysisCodeSearchTools } from './codeSearch.js';
import { handlerDeviceDataOperationsTools } from './deviceDataOperations.js';
import { handlerDeviceDeleteDataTools } from './deviceDeleteData.js';
import { handlerDevicesOperationsTools } from './devicesOperations.js';
import { handlerDocumentationSearchTools } from './documentationSearch.js';
import { handlerEntitiesTools } from './entities/index.js';
import { handlerIntegrationTools } from './integration/index.js';
import { handlerProfileMetricsTools } from './profile/index.js';
import { handlerUsersTools } from './run-users/index.js';

/**
 * @description Register tools for the MCP server.
 */
async function handlerTools(server: McpServer, resources: Resources) {
  // Tools for TagoIO actions
  handlerActionsTools(server, resources);
  // Tools for TagoIO analyses
  handlerAnalysesTools(server, resources);
  // Tools for TagoIO analysis code search
  handlerAnalysisCodeSearchTools(server, resources);
  // Tools for TagoIO device operations
  handlerDevicesOperationsTools(server, resources);
  // Tools for TagoIO device data operations
  handlerDeviceDataOperationsTools(server, resources);
  // Tools for TagoIO device delete data
  handlerDeviceDeleteDataTools(server, resources);
  // Tools for TagoIO entities
  handlerEntitiesTools(server, resources);
  // Tools for TagoIO users
  handlerUsersTools(server, resources);
  // Tools for TagoIO profile metrics
  handlerProfileMetricsTools(server, resources);
  // Tools for TagoIO integration
  handlerIntegrationTools(server, resources);
  // Tools for TagoIO documentation search
  handlerDocumentationSearchTools(server, resources);
}

export { handlerTools };

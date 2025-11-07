import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';

import { handlerActionsTools } from './actionOperations.js';
import { handlerAnalysesTools } from './analysisLookup.js';
import { handlerAnalysisCodeSearchTools } from './codeSearch.js';
import { handlerConnectorNetworkLookupTools } from './connectorNetworkLookup.js';
import { handlerDeviceDataOperationsTools } from './deviceDataOperations.js';
import { handlerDeviceDeleteDataTools } from './deviceDeleteData.js';
import { handlerDevicesOperationsTools } from './devicesOperations.js';
import { handlerDocumentationSearchTools } from './documentationSearch.js';
import { handlerEntityLookupTools } from './entityLookup.js';
import { handlerProfileLookupTools } from './profileLookup.js';
import { handlerProfileMetricsTools } from './profileMetrics.js';
import { handlerUserLookupTools } from './userLookup.js';

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
  handlerEntityLookupTools(server, resources);
  // Tools for TagoIO users
  handlerUserLookupTools(server, resources);
  // Tools for TagoIO profile lookup
  handlerProfileLookupTools(server, resources);
  // Tools for TagoIO profile metrics
  handlerProfileMetricsTools(server, resources);
  // Tools for TagoIO connector network lookup
  handlerConnectorNetworkLookupTools(server, resources);
  // Tools for TagoIO documentation search
  handlerDocumentationSearchTools(server, resources);
}

export { handlerTools };

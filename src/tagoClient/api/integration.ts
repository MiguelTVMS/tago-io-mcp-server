/**
 * TagoIO Integration API operations
 * Provides operations for connectors and networks
 */

import type { ConnectorQuery, NetworkQuery, Resources } from '@tago-io/sdk';

/**
 * Get network information by ID
 */
export async function getNetworkInfo(resources: Resources, networkID: string) {
  return resources.integration.networks.info(networkID);
}

/**
 * List networks with optional query parameters
 */
export async function listNetworks(resources: Resources, query?: NetworkQuery) {
  return resources.integration.networks.list(query);
}

/**
 * Get connector information by ID
 */
export async function getConnectorInfo(resources: Resources, connectorID: string) {
  return resources.integration.connectors.info(connectorID);
}

/**
 * List connectors with optional query parameters
 */
export async function listConnectors(resources: Resources, query?: ConnectorQuery) {
  return resources.integration.connectors.list(query);
}

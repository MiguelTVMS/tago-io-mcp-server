/**
 * TagoIO Entities API operations
 * Provides operations for next-generation database system
 */

import type { EntityQuery, Resources } from '@tago-io/sdk';

/**
 * Get entity information by ID
 */
export async function getEntityInfo(resources: Resources, entityID: string) {
  return resources.entities.info(entityID);
}

/**
 * List entities with optional query parameters
 */
export async function listEntities(resources: Resources, query?: EntityQuery) {
  return resources.entities.list(query);
}

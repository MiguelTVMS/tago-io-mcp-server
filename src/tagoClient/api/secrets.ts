/**
 * TagoIO Secrets API operations
 * Provides operations for secure credential storage
 */

import type { Resources } from '@tago-io/sdk';

/**
 * List secrets with optional query parameters
 */
export async function listSecrets(resources: Resources, query?: Record<string, unknown>) {
  return resources.secrets.list(query);
}

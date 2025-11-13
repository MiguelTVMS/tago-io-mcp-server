/**
 * Integration-related type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Integration resource types (connector/network)
 */
export const integrationResourceTypeSchema = z.enum(['connector', 'network']);

export type IntegrationResourceType = z.infer<typeof integrationResourceTypeSchema>;

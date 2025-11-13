/**
 * Device-related type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Flexible metadata object for additional data attributes
 * Used in device data operations for custom properties
 */
export const metadataSchema = z
  .record(z.any())
  .describe('Flexible metadata object for additional data attributes.');

export type Metadata = z.infer<typeof metadataSchema>;

/**
 * Device configuration parameter
 * Used in device operations for setting device-specific parameters
 */
export const configParamSchema = z
  .object({
    id: z
      .string()
      .describe(
        'The ID of the configuration parameter. When present, updates existing parameter. When not present, creates new parameter.'
      )
      .optional(),
    sent: z.boolean().describe('The sent status of the configuration parameter.'),
    key: z.string().describe('The key of the configuration parameter.'),
    value: z.string().describe('The value of the configuration parameter.'),
  })
  .describe('The configuration parameter of the device.');

export type ConfigParam = z.infer<typeof configParamSchema>;

/**
 * Device types in TagoIO
 */
export const deviceTypeSchema = z.enum(['mutable', 'immutable']);

export type DeviceType = z.infer<typeof deviceTypeSchema>;

/**
 * Chunk period options for immutable devices
 */
export const chunkPeriodSchema = z.enum(['day', 'week', 'month', 'quarter']);

export type ChunkPeriod = z.infer<typeof chunkPeriodSchema>;

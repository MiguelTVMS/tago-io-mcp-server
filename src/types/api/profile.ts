/**
 * Profile-related type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Profile metrics periodicity options
 */
export const periodicitySchema = z.enum(['day', 'month', 'year']);

export type Periodicity = z.infer<typeof periodicitySchema>;

/**
 * Profile metrics types
 */
export const profileMetricsTypeSchema = z.enum(['limits', 'statistics']);

export type ProfileMetricsType = z.infer<typeof profileMetricsTypeSchema>;

/**
 * Secrets query order by options
 */
export const secretsOrderBySchema = z.enum(['created_at', 'updated_at', 'key']);

export type SecretsOrderBy = z.infer<typeof secretsOrderBySchema>;

/**
 * Profile lookup operation types
 */
export const profileLookupOperationSchema = z.enum(['profile_info', 'secrets_list']);

export type ProfileLookupOperation = z.infer<typeof profileLookupOperationSchema>;

/**
 * Analysis-related type definitions for TagoIO API
 */

import { z } from 'zod';

/**
 * Analysis runtime options
 */
export const analysisRuntimeSchema = z.enum(['node', 'python']);

export type AnalysisRuntime = z.infer<typeof analysisRuntimeSchema>;

/**
 * Analysis run location options
 */
export const analysisRunOnSchema = z.enum(['tago', 'external']);

export type AnalysisRunOn = z.infer<typeof analysisRunOnSchema>;

/**
 * Code search types for documentation
 */
export const codeSearchTypeSchema = z.enum(['analysis', 'payload-parser']);

export type CodeSearchType = z.infer<typeof codeSearchTypeSchema>;

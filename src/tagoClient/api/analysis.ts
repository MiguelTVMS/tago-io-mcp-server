/**
 * TagoIO Analysis API operations
 * Provides operations for serverless code execution environments
 */

import type { AnalysisQuery, Resources } from '@tago-io/sdk';

/**
 * Get analysis information by ID
 */
export async function getAnalysisInfo(resources: Resources, analysisID: string) {
  return resources.analysis.info(analysisID);
}

/**
 * List analyses with optional query parameters
 */
export async function listAnalyses(resources: Resources, query?: AnalysisQuery) {
  return resources.analysis.list(query);
}

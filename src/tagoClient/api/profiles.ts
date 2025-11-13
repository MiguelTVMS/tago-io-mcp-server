/**
 * TagoIO Profiles API operations
 * Provides operations for profile information and statistics
 */

import type { Resources } from '@tago-io/sdk';

/**
 * Get profile information
 */
export async function getProfileInfo(resources: Resources, profileID: string) {
  return resources.profiles.info(profileID);
}

/**
 * Get profile summary (limits and usage)
 */
export async function getProfileSummary(resources: Resources, profileID: string) {
  return resources.profiles.summary(profileID);
}

/**
 * Get profile usage statistics
 */
export async function getProfileUsageStatistics(
  resources: Resources,
  profileID: string,
  // biome-ignore lint/suspicious/noExplicitAny: SDK type mismatch, options are dynamically built
  options?: any
) {
  return resources.profiles.usageStatisticList(profileID, options);
}

/**
 * TagoIO Run Users API operations
 * Provides operations for TagoRUN user management
 */

import type { Resources, UserQuery } from '@tago-io/sdk';

/**
 * Get run user information by ID
 */
export async function getRunUserInfo(resources: Resources, userID: string) {
    return resources.run.userInfo(userID);
}

/**
 * List run users with optional query parameters
 */
export async function listRunUsers(resources: Resources, query: UserQuery) {
    return resources.run.listUsers(query);
}

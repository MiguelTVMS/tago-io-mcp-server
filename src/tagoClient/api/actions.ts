/**
 * TagoIO Actions API operations
 * Provides CRUD operations for automation actions
 */

import type { ActionCreateInfo, ActionQuery, Resources } from '@tago-io/sdk';

/**
 * Get action information by ID
 */
export async function getActionInfo(resources: Resources, actionID: string) {
    return resources.actions.info(actionID);
}

/**
 * List actions with optional query parameters
 */
export async function listActions(resources: Resources, query?: ActionQuery) {
    return resources.actions.list(query);
}

/**
 * Create a new action
 */
export async function createAction(resources: Resources, data: ActionCreateInfo) {
    return resources.actions.create(data);
}

/**
 * Update an existing action
 */
export async function updateAction(
    resources: Resources,
    actionID: string,
    data: Partial<ActionCreateInfo>
) {
    return resources.actions.edit(actionID, data);
}

/**
 * Delete an action
 */
export async function deleteAction(resources: Resources, actionID: string) {
    return resources.actions.delete(actionID);
}

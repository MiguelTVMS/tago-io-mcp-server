import type { IDeviceToolConfig } from '../../../types/index.js';
import { entityOperationsConfigJSON } from './entity-operations';

/**
 * @description Array of all entity tool configurations.
 * Each tool configuration follows the IDeviceToolConfig interface structure
 * and will be automatically registered in the MCP server.
 */
const entityTools: IDeviceToolConfig[] = [entityOperationsConfigJSON];

export { entityTools };

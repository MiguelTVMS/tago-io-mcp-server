/**
 * TagoIO Devices API operations
 * Provides CRUD operations for IoT device entities
 */

import type {
    ConfigurationParams,
    DataCreate,
    DataEdit,
    DataQuery,
    DeviceCreateInfo,
    DeviceEditInfo,
    DeviceQuery,
    Resources,
    TokenData,
} from '@tago-io/sdk';
import { Device } from '@tago-io/sdk';

/**
 * Get device information by ID
 */
export async function getDeviceInfo(resources: Resources, deviceID: string) {
    return resources.devices.info(deviceID);
}

/**
 * List devices with optional query parameters
 */
export async function listDevices(resources: Resources, query?: DeviceQuery) {
    return resources.devices.list(query);
}

/**
 * Create a new device
 */
export async function createDevice(resources: Resources, data: DeviceCreateInfo) {
    return resources.devices.create(data);
}

/**
 * Update an existing device
 */
export async function updateDevice(resources: Resources, deviceID: string, data: DeviceEditInfo) {
    return resources.devices.edit(deviceID, data);
}

/**
 * Delete a device
 */
export async function deleteDevice(resources: Resources, deviceID: string) {
    return resources.devices.delete(deviceID);
}

/**
 * Get device data amount
 */
export async function getDeviceDataAmount(resources: Resources, deviceID: string) {
    return resources.devices.amount(deviceID);
}

/**
 * List device configuration parameters
 */
export async function listDeviceParams(resources: Resources, deviceID: string) {
    return resources.devices.paramList(deviceID);
}

/**
 * Set device configuration parameters
 */
export async function setDeviceParams(
    resources: Resources,
    deviceID: string,
    params: ConfigurationParams | ConfigurationParams[]
) {
    return resources.devices.paramSet(deviceID, params);
}

/**
 * List device tokens
 */
export async function listDeviceTokens(resources: Resources, deviceID: string) {
    return resources.devices.tokenList(deviceID);
}

/**
 * Delete a device token
 */
export async function deleteDeviceToken(resources: Resources, token: string) {
    return resources.devices.tokenDelete(token);
}

/**
 * Create a device token
 */
export async function createDeviceToken(resources: Resources, deviceID: string, data: TokenData) {
    return resources.devices.tokenCreate(deviceID, data);
}

/**
 * Send data to a device (using analysis token)
 */
export async function sendDeviceData(resources: Resources, deviceID: string, data: DataCreate[]) {
    return resources.devices.sendDeviceData(deviceID, data);
}

/**
 * Edit device data (using analysis token)
 */
export async function editDeviceData(resources: Resources, deviceID: string, data: DataEdit[]) {
    return resources.devices.editDeviceData(deviceID, data);
}

/**
 * Get device data (using analysis token)
 */
export async function getDeviceData(resources: Resources, deviceID: string, query?: DataQuery) {
    return resources.devices.getDeviceData(deviceID, query);
}

/**
 * Delete device data (using analysis token)
 */
export async function deleteDeviceData(resources: Resources, deviceID: string, query?: DataQuery) {
    return resources.devices.deleteDeviceData(deviceID, query);
}

/**
 * Create a Device instance for device token operations
 */
export function createDeviceInstance(token: string): Device {
    return new Device({ token });
}

/**
 * Send data using device token
 */
export async function sendDataWithDeviceToken(device: Device, data: DataCreate[]) {
    return device.sendData(data);
}

/**
 * Edit data using device token
 */
export async function editDataWithDeviceToken(device: Device, data: DataEdit[]) {
    return device.editData(data);
}

/**
 * Get data using device token
 */
export async function getDataWithDeviceToken(device: Device, query?: DataQuery) {
    // @ts-expect-error - The getData method is not typed according to the DataQuery type from the Resources.
    return device.getData(query);
}

/**
 * Delete data using device token
 */
export async function deleteDataWithDeviceToken(device: Device, query?: DataQuery) {
    return device.deleteData(query);
}

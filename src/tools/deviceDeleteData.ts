// Note: DataQuery SDK type is reported as an "error" type by TypeScript
// This causes cascading unsafe operation warnings throughout this file

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Device, type Resources } from '@tago-io/sdk';
import type { DataQuery } from '@tago-io/sdk';
import { z } from 'zod';
import { config } from '../config.js';
import type { IDeviceToolConfig } from '../types/index.js';

const querySchema = z.object({
  query: z
    .enum([
      'default',
      'last_item',
      'last_value',
      'last_location',
      'last_insert',
      'first_item',
      'first_value',
      'first_location',
      'first_insert',
      'min',
      'max',
      'count',
      'avg',
      'sum',
      'aggregate',
      'conditional',
    ])
    .describe(
      `
        Type of query to perform. Determines how device data is retrieved and processed.

        Available queries:
        - default: Retrieves multiple data records with pagination support (use with qty and skip)
        - last_item: Returns the most recent record across all variables
        - last_value: Returns the most recent value for specified variable(s)
        - last_location: Returns the most recent location data point
        - last_insert: Returns the most recently inserted record regardless of timestamp
        - first_item: Returns the oldest record across all variables
        - first_value: Returns the oldest value for specified variable(s)
        - first_location: Returns the oldest location data point
        - first_insert: Returns the first inserted record regardless of timestamp
        - min: Calculates the minimum value among the filtered records (requires start_date; the period interval must not exceed one month)
        - max: Calculates the maximum value among the filtered records (requires start_date; the period interval must not exceed one month)
        - count: Returns the total count of records matching the filter criteria (requires start_date; the period interval must not exceed one month)
        - avg: Calculates the average value over time (requires start_date; the period interval must not exceed one month)
        - sum: Calculates the sum of values over time (requires start_date; the period interval must not exceed one month)
        - aggregate: Groups and aggregates data by time intervals (requires interval and function parameters)
        - conditional: Filters data based on value comparison (requires start_date, value, and function parameters)

        Note: If the 'end_date' field is not provided, the API will use the current date as the default value.
      `
    )
    .optional(),

  // Common parameters
  variables: z
    .array(z.string())
    .describe("Filter by variables. Array of variable names. E.g: ['temperature', 'humidity']")
    .optional(),
  groups: z
    .array(z.string())
    .describe("Filter by groups. Array of group names. E.g: ['sensors', 'actuators']")
    .optional(),
  ids: z
    .array(z.string())
    .describe(
      "Filter by record IDs. Array of record IDs. E.g: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']"
    )
    .optional(),
  values: z
    .array(z.union([z.string(), z.number(), z.boolean()]))
    .describe("Filter by values. Array of string/number/boolean values. E.g: [25.5, 'high', true]")
    .optional(),
  start_date: z
    .string()
    .describe("Start date for filtering data as ISO string. E.g: 'YYYY-MM-DDTHH:MM:SSZ' (ISO 8601)")
    .optional(),
  end_date: z
    .string()
    .describe(
      "End date for filtering data as ISO string. Default is current date. E.g: 'YYYY-MM-DDTHH:MM:SSZ' (ISO 8601)"
    )
    .optional(),

  // Default query parameters
  qty: z
    .number()
    .min(1)
    .max(10000)
    .describe('Quantity of records to retrieve (max: 10000, min: 1, default: 15)')
    .optional(),
  ordination: z
    .enum(['descending', 'ascending'])
    .describe("Change ordination of query. Default is 'descending'. E.g: 'ascending'")
    .optional(),
  skip: z
    .number()
    .min(0)
    .describe('Skip records, used on pagination or polling. E.g: 50')
    .optional(),

  // Aggregate query parameters
  interval: z
    .enum(['minute', 'hour', 'day', 'month', 'quarter', 'year'])
    .describe(
      `
        Time interval for aggregation. Used with query='aggregate'. E.g: 'day'

        Available intervals: minute, hour, day, month, quarter, year.
      `
    )
    .optional(),
  function: z
    .enum(['avg', 'sum', 'min', 'max', 'gt', 'gte', 'lt', 'lte', 'eq', 'ne'])
    .describe(
      `
        Function to apply.

        For aggregate query:
        - avg: Calculate the average value for each interval
        - sum: Calculate the sum of values for each interval
        - min: Find the minimum value in each interval
        - max: Find the maximum value in each interval

        For conditional query:
        - gt: Greater than (>)
        - gte: Greater than or equal to (>=)
        - lt: Less than (<)
        - lte: Less than or equal to (<=)
        - eq: Equal to (==)
        - ne: Not equal to (!=)

        E.g: 'avg'
      `
    )
    .optional(),

  // Conditional query parameters
  value: z
    .number()
    .describe("Value to compare against. Used with query='conditional'. E.g: 25.5")
    .optional(),
});

// Query validation utility
// biome-ignore lint/suspicious/noExplicitAny: Query validation requires flexible input handling
function validateDeviceDataQuery(query: any): DataQuery | undefined {
  if (!query) {
    return undefined;
  }

  const queryObj = query as Record<string, unknown>;
  if (queryObj.query === 'conditional') {
    const { start_date, value, function: fn } = queryObj;
    if (typeof start_date === 'string' && typeof value === 'number' && typeof fn === 'string') {
      return query;
    }
    throw new Error(
      'Missing required fields for conditional query: start_date (string), value (number), function (string)'
    );
  }

  if (queryObj.query === 'aggregate') {
    const { interval, function: fn } = queryObj;
    if (typeof interval === 'string' && typeof fn === 'string') {
      return query;
    }
    throw new Error(
      'Missing required fields for aggregate query: interval (string), function (string)'
    );
  }
  // For all other queries, return as is
  return queryObj as DataQuery;
}

// Base schema without refinement - this provides the .shape property needed by MCP
const deviceDeleteDataBaseSchema = z
  .object({
    deviceID: z
      .string({ required_error: 'Device ID is required' })
      .length(24, 'Device ID must be 24 characters long')
      .describe('The ID of the device to perform the operation on.'),
    // Fields for delete operations
    query: z
      .object(querySchema.shape)
      .omit({ query: true })
      .describe('The query object contains deletion criteria with several optional parameters.')
      .optional(),
  })
  .describe(
    'Schema for the device data delete operation. Data Delete require the device to be of the mutable type.'
  );

// Refined schema with validation logic
const deviceDeleteDataSchema = deviceDeleteDataBaseSchema.refine(
  () => {
    // Delete operations are valid with or without query
    return true;
  },
  {
    message: 'Invalid data structure for the specified operation. Delete requires query.',
  }
);

type DeviceDeleteDataOperation = z.infer<typeof deviceDeleteDataSchema>;

// Simple delete operation - analysis token
async function deleteWithAnalysisToken(
  resources: Resources,
  deviceID: string,
  query?: DataQuery
): Promise<string> {
  const result = await resources.devices.deleteDeviceData(deviceID, query);
  // SDK returns string for delete operation
  return String(result);
}

// Simple delete operation - device token
async function deleteWithDeviceToken(
  resources: Resources,
  _api: string,
  deviceID: string,
  query?: DataQuery
): Promise<string> {
  const [deviceToken] = await resources.devices.tokenList(deviceID);
  const device = new Device({
    token: deviceToken.token,
  });

  const result = await device.deleteData(query);
  // SDK returns string for delete operation
  return String(result);
}

async function deviceDataDeleteTool(resources: Resources, params: DeviceDeleteDataOperation) {
  const validatedParams = deviceDeleteDataSchema.parse(params);
  const query = validateDeviceDataQuery(validatedParams.query);

  const token = config.TAGOIO_TOKEN;
  const api = config.TAGOIO_API;

  // Simple token type check and direct function call
  return token.startsWith('a-')
    ? deleteWithAnalysisToken(resources, validatedParams.deviceID, query)
    : deleteWithDeviceToken(resources, api, validatedParams.deviceID, query);
}

const deviceDeleteDataConfigJSON: IDeviceToolConfig = {
  name: 'deviceDeleteData',
  description: `The DeviceDataDelete tool removes specific data points from IoT devices and data collection systems within the platform

  Do not use this tool on immutable devices, as deletion operations will fail.

Delete query parameters apply individually to each specified variable. For example, setting qty to 2 will delete 2 data points from each variable listed in the variables array.

<example>
  {
    "deviceID": "68531cc713af9d000af75d5c",
    "query": {
      "qty": 1,
      "skip": 0,
      "variables": ["temperature", "humidity],
      "groups": ["123456789"]
    }
  }
</example>`,
  parameters: deviceDeleteDataBaseSchema.shape,
  title: 'Device Data Delete',
  tool: deviceDataDeleteTool,
};

/**
 * @description Array of all device delete data tool configurations.
 */
const deviceDeleteDataTools: IDeviceToolConfig[] = [deviceDeleteDataConfigJSON];

/**
 * @description Handler for device delete data tools to register tools in the MCP server.
 */
function handlerDeviceDeleteDataTools(server: McpServer, resources: Resources) {
  for (const toolConfig of deviceDeleteDataTools) {
    server.tool(
      toolConfig.name,
      toolConfig.description,
      toolConfig.parameters,
      { title: toolConfig.title },
      async (params) => {
        const result = await toolConfig.tool(resources, params);
        return { content: [{ type: 'text', text: result }] };
      }
    );
  }
}

export { handlerDeviceDeleteDataTools };
export { deviceDeleteDataBaseSchema }; // export for testing purposes

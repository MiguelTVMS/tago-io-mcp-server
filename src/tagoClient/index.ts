import { Resources } from '@tago-io/sdk';

import { config } from '../config.js';
import { type IHeadersModel, headersModel } from '../utils/config.model.js';
import { getZodError } from '../utils/get-zod-error.js';
import { logger } from '../utils/logger.js';

/**
 * TagoIO API client wrapper.
 * Provides methods for creating and validating TagoIO Resources instances.
 */

/**
 * Create and validate a TagoIO Resources instance with the configured token.
 *
 * @returns Validated Resources instance
 * @throws Error if TAGOIO_TOKEN is not configured or connection fails
 */
async function createClient(): Promise<Resources> {
  if (!config.TAGOIO_TOKEN) {
    throw new Error('TAGOIO_TOKEN environment variable is required');
  }

  // Set the TagoIO API endpoint
  process.env.TAGOIO_API = config.TAGOIO_API;

  // Initialize TagoIO Resources with the token
  const resources = new Resources({ token: config.TAGOIO_TOKEN });

  // Validate the connection to TagoIO API
  await resources.account.info().catch(() => {
    throw new Error(
      'Failed to connect to TagoIO API. Please check your TAGOIO_TOKEN and TAGOIO_API configuration.'
    );
  });

  logger.debug('TagoIO client created and validated successfully');

  return resources;
}

/**
 * Authenticate a client request and create a TagoIO Resources instance.
 * Validates the headers provided by the client and returns the resources.
 * This is used for HTTP server mode where each request has its own credentials.
 *
 * @param token - Authorization token from request headers
 * @param tagoioApi - TagoIO API endpoint from request headers
 * @returns Validated Resources instance
 * @throws Error if headers are invalid or connection fails
 */
async function authenticateClient({
  token,
  tagoioApi,
}: {
  token: string | undefined;
  tagoioApi: string | string[] | undefined;
}): Promise<Resources> {
  const headers = (await headersModel
    .parseAsync({ authorization: token, 'tagoio-api': tagoioApi })
    .catch(getZodError)
    .catch((error) => {
      throw new Error(`Bad Request: ${error}`);
    })) as IHeadersModel;

  // Set the TagoIO-API environment variable from the request header.
  // This allows the @tago-io/sdk to use the provided API endpoint.
  process.env.TAGOIO_API = headers['tagoio-api'];

  const resources = new Resources({ token: headers.authorization });

  await resources.account.info().catch(() => {
    throw new Error(
      "Unauthorized: The Authorization or TagoIO-API header is invalid, can't connect to the TagoIO API, check the headers and try again."
    );
  });

  logger.debug('Client authenticated successfully');

  return resources;
}

export { createClient, authenticateClient };

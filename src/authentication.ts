import { Resources } from '@tago-io/sdk';

import { headersModel, IHeadersModel } from './utils/config.model';
import { getZodError } from './utils/get-zod-error';

/**
 * @description Validate the headers provided by the client and return the resources.
 */
async function authenticate({
  token,
  tagoioApi,
}: {
  token: string | undefined;
  tagoioApi: string | string[] | undefined;
}) {
  const headers = (await headersModel
    .parseAsync({ authorization: token, 'tagoio-api': tagoioApi })
    .catch(getZodError)
    .catch((error) => {
      throw new Error(`Bad Request: ${error}`);
    })) as IHeadersModel;

  // * Set the TagoIO-API environment variable from the request header.
  // * This allows the @tago-io/sdk to use the provided API endpoint.
  process.env.TAGOIO_API = headers['tagoio-api'];

  const resources = new Resources({ token: headers.authorization });

  await resources.account.info().catch(() => {
    throw new Error(
      "Unauthorized: The Authorization or TagoIO-API header is invalid, can't connect to the TagoIO API, check the headers and try again."
    );
  });

  return resources;
}

export { authenticate };

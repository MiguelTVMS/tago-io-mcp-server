import * as dotenv from 'dotenv';

import { type IEnvironmentModel, environmentModel } from './config.model';

// Load environment variables from .env file.
dotenv.config();

export const ENV: IEnvironmentModel = environmentModel.parse({
  LOG_LEVEL: process.env.LOG_LEVEL,
  TAGOIO_TOKEN: process.env.TAGOIO_TOKEN,
  TAGOIO_API: process.env.TAGOIO_API,
  NODE_ENV: process.env.NODE_ENV,
  TEST: process.env.TEST,
});

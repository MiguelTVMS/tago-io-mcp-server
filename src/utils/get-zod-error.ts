import { ZodError } from 'zod';

/**
 * Function to get the error message from zod
 * @param error
 * @returns
 */
function getZodError(error: ZodError) {
  if (error instanceof ZodError) {
    throw new Error(error.issues.shift()?.message);
  }
  throw new Error(String(error));
}

export { getZodError };

import * as dotenv from 'dotenv';
import { z } from 'zod';
import { isValidBindAddress, isValidOrigin } from './utils/config-validations.js';

// Load environment variables from .env file
dotenv.config();

/**
 * TagoIO Configuration Schema
 */
const tagoioConfigSchema = z.object({
  TAGOIO_TOKEN: z.string().min(1, 'TAGOIO_TOKEN is required'),
  TAGOIO_API: z.string().url().default('https://api.us-e1.tago.io'),
});

/**
 * MCP Generic Server Configuration Schema
 */
const mcpServerConfigSchema = z.object({
  MCP_SERVER_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MCP_SERVER_LOG_FORMAT: z.enum(['plain', 'json', 'gcp-json']).default('plain'),
  MCP_SERVER_USE_HTTP: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
  MCP_SERVER_STATEFUL: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
});

/**
 * MCP Server HTTP Configuration Schema
 */
const mcpHttpConfigSchema = z.object({
  MCP_HTTP_TRANSPORT: z.enum(['stream', 'sse']).default('stream'),
  MCP_HTTP_PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().positive())
    .default('3000'),
  MCP_HTTP_HOST: z.string().default('0.0.0.0'),
  MCP_HTTP_PATH: z.string().optional(),
  MCP_HTTP_BIND_ADDR: z
    .string()
    .refine((val) => val.length > 0, {
      message: 'MCP_HTTP_BIND_ADDR cannot be empty',
    })
    .refine((val) => isValidBindAddress(val), {
      message: 'MCP_HTTP_BIND_ADDR must be a valid IPv4 or IPv6 address',
    })
    .default('127.0.0.1'),
  MCP_HTTP_ENABLE_HEALTHCHECK: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
  MCP_HTTP_HEALTHCHECK_PATH: z.string().default('/healthz'),
  MCP_HTTP_ALLOW_CORS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('true'),
  MCP_HTTP_ALLOWED_ORIGINS: z
    .string()
    .refine((val) => val.length > 0, {
      message: 'MCP_HTTP_ALLOWED_ORIGINS cannot be empty',
    })
    .transform((val) => val.split(',').map((o) => o.trim()))
    .refine((origins) => origins.every((origin) => isValidOrigin(origin)), {
      message:
        'All origins in MCP_HTTP_ALLOWED_ORIGINS must be valid hostnames, IPv4, or IPv6 addresses',
    })
    .default('127.0.0.1,localhost'),
  MCP_HTTP_NGROK_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
  MCP_HTTP_NGROK_AUTH_TOKEN: z.string().optional(),
});

/**
 * Additional Configuration Schema
 */
const additionalConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARNING', 'ERROR']).optional().default('INFO'),
  TEST: z.string().optional(),
});

/**
 * Combined Configuration Schema
 */
const configSchema = tagoioConfigSchema
  .merge(mcpServerConfigSchema)
  .merge(mcpHttpConfigSchema)
  .merge(additionalConfigSchema)
  .transform((config) => {
    // Set default path based on transport if not explicitly provided
    if (!config.MCP_HTTP_PATH) {
      config.MCP_HTTP_PATH = config.MCP_HTTP_TRANSPORT === 'sse' ? '/sse' : '/mcp';
    }
    return config;
  });

/**
 * Validate ngrok configuration
 */
const validateNgrokConfig = (config: z.infer<typeof configSchema>) => {
  if (config.MCP_HTTP_NGROK_ENABLED && !config.MCP_HTTP_NGROK_AUTH_TOKEN) {
    throw new Error('MCP_HTTP_NGROK_AUTH_TOKEN is required when MCP_HTTP_NGROK_ENABLED is true');
  }
  return config;
};

/**
 * Parse and validate environment variables
 */
const parseConfig = () => {
  const rawConfig = {
    // TagoIO Configuration
    TAGOIO_TOKEN: process.env.TAGOIO_TOKEN,
    TAGOIO_API: process.env.TAGOIO_API,

    // MCP Generic Server Configuration
    MCP_SERVER_LOG_LEVEL: process.env.MCP_SERVER_LOG_LEVEL,
    MCP_SERVER_LOG_FORMAT: process.env.MCP_SERVER_LOG_FORMAT,
    MCP_SERVER_USE_HTTP: process.env.MCP_SERVER_USE_HTTP,
    MCP_SERVER_STATEFUL: process.env.MCP_SERVER_STATEFUL,

    // MCP Server HTTP Configuration
    MCP_HTTP_TRANSPORT: process.env.MCP_HTTP_TRANSPORT,
    MCP_HTTP_PORT: process.env.MCP_HTTP_PORT,
    MCP_HTTP_HOST: process.env.MCP_HTTP_HOST,
    MCP_HTTP_PATH: process.env.MCP_HTTP_PATH,
    MCP_HTTP_BIND_ADDR: process.env.MCP_HTTP_BIND_ADDR,
    MCP_HTTP_ENABLE_HEALTHCHECK: process.env.MCP_HTTP_ENABLE_HEALTHCHECK,
    MCP_HTTP_HEALTHCHECK_PATH: process.env.MCP_HTTP_HEALTHCHECK_PATH,
    MCP_HTTP_ALLOW_CORS: process.env.MCP_HTTP_ALLOW_CORS,
    MCP_HTTP_ALLOWED_ORIGINS: process.env.MCP_HTTP_ALLOWED_ORIGINS,
    MCP_HTTP_NGROK_ENABLED: process.env.MCP_HTTP_NGROK_ENABLED,
    MCP_HTTP_NGROK_AUTH_TOKEN: process.env.MCP_HTTP_NGROK_AUTH_TOKEN,

    // Additional Configuration
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    TEST: process.env.TEST,
  };

  const parsedConfig = configSchema.parse(rawConfig);
  return validateNgrokConfig(parsedConfig);
};

/**
 * Validated configuration object
 */
export const config = parseConfig();

/**
 * Type definitions
 */
export type Config = typeof config;
export type TagoIOConfig = z.infer<typeof tagoioConfigSchema>;
export type MCPServerConfig = z.infer<typeof mcpServerConfigSchema>;
export type MCPHttpConfig = z.infer<typeof mcpHttpConfigSchema>;

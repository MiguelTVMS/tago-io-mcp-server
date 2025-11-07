import pino from 'pino';
import { config } from '../config.js';

/**
 * Log levels supported by the logger
 */
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * Create Pino logger instance based on configuration
 */
function createPinoLogger() {
    const level = config.MCP_SERVER_LOG_LEVEL;
    const format = config.MCP_SERVER_LOG_FORMAT;
    const useHttp = config.MCP_SERVER_USE_HTTP;

    // In stdio mode (MCP_SERVER_USE_HTTP=false), use stderr to avoid interleaving with MCP output
    // In HTTP mode (MCP_SERVER_USE_HTTP=true), use stdout for standard log output
    const outputFd = useHttp ? 1 : 2; // 1 = stdout, 2 = stderr
    const outputStream = pino.destination({ dest: outputFd, sync: false });

    // Base Pino options
    const baseOptions: pino.LoggerOptions = {
        level,
    };

    // Configure transport based on format
    if (format === 'plain') {
        // Use pino-pretty for human-readable output
        return pino(
            {
                ...baseOptions,
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: useHttp ? process.stdout.isTTY : process.stderr.isTTY,
                        translateTime: 'SYS:standard',
                        ignore: 'pid,hostname',
                        destination: outputFd,
                    },
                },
            },
        );
    }

    if (format === 'gcp-json') {
        // GCP-compatible JSON format
        return pino(
            {
                ...baseOptions,
                formatters: {
                    level: (label) => {
                        // Map Pino levels to GCP severity levels
                        const severityMap: Record<string, string> = {
                            trace: 'DEBUG',
                            debug: 'DEBUG',
                            info: 'INFO',
                            warn: 'WARNING',
                            error: 'ERROR',
                            fatal: 'CRITICAL',
                        };
                        return { severity: severityMap[label] || 'DEFAULT' };
                    },
                },
                timestamp: pino.stdTimeFunctions.isoTime,
            },
            outputStream,
        );
    }

    // Default: standard JSON format
    return pino(
        {
            ...baseOptions,
            timestamp: pino.stdTimeFunctions.isoTime,
        },
        outputStream,
    );
}

/**
 * Logger wrapper class for consistent API
 */
class Logger {
    private pino: pino.Logger;

    constructor() {
        this.pino = createPinoLogger();
    }

    /**
     * Log a debug message
     */
    debug(message: string, context?: Record<string, unknown>): void {
        if (context) {
            this.pino.debug(context, message);
        } else {
            this.pino.debug(message);
        }
    }

    /**
     * Log an info message
     */
    info(message: string, context?: Record<string, unknown>): void {
        if (context) {
            this.pino.info(context, message);
        } else {
            this.pino.info(message);
        }
    }

    /**
     * Log a warning message
     */
    warn(message: string, context?: Record<string, unknown>): void {
        if (context) {
            this.pino.warn(context, message);
        } else {
            this.pino.warn(message);
        }
    }

    /**
     * Log an error message
     */
    error(message: string, error?: Error, context?: Record<string, unknown>): void {
        const logContext = { ...context };
        if (error) {
            logContext.err = error;
        }

        if (Object.keys(logContext).length > 0) {
            this.pino.error(logContext, message);
        } else {
            this.pino.error(message);
        }
    }

    /**
     * Log an error message with just a message (convenience method)
     */
    errorMessage(message: string): void {
        this.error(message);
    }

    /**
     * Get the underlying Pino logger instance (for advanced usage)
     */
    getPinoInstance(): pino.Logger {
        return this.pino;
    }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Export Logger class for testing purposes
 */
export { Logger };

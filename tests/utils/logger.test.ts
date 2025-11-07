import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock config with stdio mode (MCP_SERVER_USE_HTTP=false)
vi.mock('../../src/config.js', () => ({
    config: {
        MCP_SERVER_LOG_LEVEL: 'debug',
        MCP_SERVER_LOG_FORMAT: 'json',
        MCP_SERVER_USE_HTTP: false, // stdio mode
    },
}));

describe('Logger', () => {
    let stderrWriteSpy: Mock;
    let stdoutWriteSpy: Mock;

    beforeEach(async () => {
        // Clear module cache to ensure fresh logger instance
        vi.clearAllMocks();

        // Spy on stderr.write to capture log output
        stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        stderrWriteSpy.mockRestore();
        stdoutWriteSpy.mockRestore();
    });

    describe('log levels', () => {
        it('should log debug messages', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.debug('Debug message');

            // In stdio mode, should use stderr
            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Debug message"');
        });

        it('should log info messages', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.info('Info message');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Info message"');
        });

        it('should log warn messages', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.warn('Warning message');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Warning message"');
        });

        it('should log error messages', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.error('Error message');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Error message"');
        });
    });

    describe('context and error handling', () => {
        it('should log with context', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.info('Message with context', { userId: '123', action: 'create' });

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            // Pino includes context fields in JSON
            expect(output).toContain('"userId":"123"');
            expect(output).toContain('"action":"create"');
        });

        it('should log error objects', async () => {
            const { logger } = await import('../../src/utils/logger.js');
            const error = new Error('Test error');

            logger.error('Error occurred', error);

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            // Pino uses 'err' key for errors
            expect(output).toContain('"err"');
            expect(output).toContain('Test error');
        });

        it('should log error with context', async () => {
            const { logger } = await import('../../src/utils/logger.js');
            const error = new Error('Test error');

            logger.error('Error occurred', error, { operation: 'delete' });

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('Test error');
            expect(output).toContain('"operation":"delete"');
        });

        it('should handle errorMessage convenience method', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.errorMessage('Simple error');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Simple error"');
        });
    });

    describe('stdio mode (MCP_SERVER_USE_HTTP=false)', () => {
        it('should write to stderr in stdio mode', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.info('Test message');

            // In stdio mode, logs should go to stderr
            expect(stderrWriteSpy).toHaveBeenCalled();
            expect(stdoutWriteSpy).not.toHaveBeenCalled();
        });

        it('should write all log levels to stderr', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.debug('Debug');
            logger.info('Info');
            logger.warn('Warn');
            logger.error('Error');

            // All should go to stderr in stdio mode
            expect(stderrWriteSpy).toHaveBeenCalledTimes(4);
            expect(stdoutWriteSpy).not.toHaveBeenCalled();
        });
    });
});

describe('Logger - HTTP Mode', () => {
    let stderrWriteSpy: Mock;
    let stdoutWriteSpy: Mock;

    beforeEach(async () => {
        // Clear module cache
        vi.clearAllMocks();
        vi.resetModules();

        // Mock config with HTTP mode
        vi.doMock('../src/config.js', () => ({
            config: {
                MCP_SERVER_LOG_LEVEL: 'debug',
                MCP_SERVER_LOG_FORMAT: 'json',
                MCP_SERVER_USE_HTTP: true, // HTTP mode
            },
        }));

        stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        stderrWriteSpy.mockRestore();
        stdoutWriteSpy.mockRestore();
        vi.resetModules();
    });

    describe('HTTP mode (MCP_SERVER_USE_HTTP=true)', () => {
        it('should write to stdout in HTTP mode', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.info('Test message');

            // In HTTP mode, logs should go to stdout
            expect(stdoutWriteSpy).toHaveBeenCalled();
            const output = stdoutWriteSpy.mock.calls[0][0] as string;
            expect(output).toContain('"msg":"Test message"');
        });

        it('should write all log levels to stdout', async () => {
            const { logger } = await import('../../src/utils/logger.js');

            logger.debug('Debug');
            logger.info('Info');
            logger.warn('Warn');
            logger.error('Error');

            // All should go to stdout in HTTP mode
            expect(stdoutWriteSpy).toHaveBeenCalledTimes(4);
        });
    });
});

describe('Logger - Log Formats', () => {
    let stderrWriteSpy: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        stderrWriteSpy.mockRestore();
        vi.resetModules();
    });

    describe('JSON format', () => {
        it('should output valid JSON', async () => {
            vi.doMock('../src/config.js', () => ({
                config: {
                    MCP_SERVER_LOG_LEVEL: 'info',
                    MCP_SERVER_LOG_FORMAT: 'json',
                    MCP_SERVER_USE_HTTP: false,
                },
            }));

            const { logger } = await import('../../src/utils/logger.js');
            logger.info('Test message');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;

            // Should be valid JSON
            expect(() => JSON.parse(output)).not.toThrow();
            const parsed = JSON.parse(output);
            expect(parsed.msg).toBe('Test message');
            expect(parsed.level).toBeDefined();
            expect(parsed.time).toBeDefined();
        });
    });

    describe('GCP JSON format', () => {
        it('should output GCP-compatible JSON with severity field', async () => {
            vi.doMock('../src/config.js', () => ({
                config: {
                    MCP_SERVER_LOG_LEVEL: 'info',
                    MCP_SERVER_LOG_FORMAT: 'gcp-json',
                    MCP_SERVER_USE_HTTP: false,
                },
            }));

            const { logger } = await import('../../src/utils/logger.js');
            logger.warn('Warning message');

            expect(stderrWriteSpy).toHaveBeenCalled();
            const output = stderrWriteSpy.mock.calls[0][0] as string;

            const parsed = JSON.parse(output);
            expect(parsed.severity).toBe('WARNING');
            expect(parsed.msg).toBe('Warning message');
        });

        it('should map all log levels to GCP severity', async () => {
            vi.doMock('../src/config.js', () => ({
                config: {
                    MCP_SERVER_LOG_LEVEL: 'debug',
                    MCP_SERVER_LOG_FORMAT: 'gcp-json',
                    MCP_SERVER_USE_HTTP: false,
                },
            }));

            const { logger } = await import('../../src/utils/logger.js');

            logger.debug('Debug');
            logger.info('Info');
            logger.warn('Warn');
            logger.error('Error');

            expect(stderrWriteSpy).toHaveBeenCalledTimes(4);

            const severities = stderrWriteSpy.mock.calls.map(call => {
                const output = call[0] as string;
                return JSON.parse(output).severity;
            });

            expect(severities).toEqual(['DEBUG', 'INFO', 'WARNING', 'ERROR']);
        });
    });
});

describe('Logger - Log Levels', () => {
    let stderrWriteSpy: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        stderrWriteSpy.mockRestore();
        vi.resetModules();
    });

    it('should respect log level filtering - info level', async () => {
        vi.doMock('../src/config.js', () => ({
            config: {
                MCP_SERVER_LOG_LEVEL: 'info',
                MCP_SERVER_LOG_FORMAT: 'json',
                MCP_SERVER_USE_HTTP: false,
            },
        }));

        const { logger } = await import('../../src/utils/logger.js');

        logger.debug('Debug message'); // Should not log
        logger.info('Info message');   // Should log
        logger.warn('Warn message');   // Should log
        logger.error('Error message'); // Should log

        // Debug should be filtered out, only 3 messages should be logged
        expect(stderrWriteSpy).toHaveBeenCalledTimes(3);
    });

    it('should respect log level filtering - warn level', async () => {
        vi.doMock('../src/config.js', () => ({
            config: {
                MCP_SERVER_LOG_LEVEL: 'warn',
                MCP_SERVER_LOG_FORMAT: 'json',
                MCP_SERVER_USE_HTTP: false,
            },
        }));

        const { logger } = await import('../../src/utils/logger.js');

        logger.debug('Debug message'); // Should not log
        logger.info('Info message');   // Should not log
        logger.warn('Warn message');   // Should log
        logger.error('Error message'); // Should log

        // Only warn and error should be logged
        expect(stderrWriteSpy).toHaveBeenCalledTimes(2);
    });

    it('should respect log level filtering - error level', async () => {
        vi.doMock('../src/config.js', () => ({
            config: {
                MCP_SERVER_LOG_LEVEL: 'error',
                MCP_SERVER_LOG_FORMAT: 'json',
                MCP_SERVER_USE_HTTP: false,
            },
        }));

        const { logger } = await import('../../src/utils/logger.js');

        logger.debug('Debug message'); // Should not log
        logger.info('Info message');   // Should not log
        logger.warn('Warn message');   // Should not log
        logger.error('Error message'); // Should log

        // Only error should be logged
        expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
    });
});

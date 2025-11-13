/**
 * Centralized type definitions for the MCP server.
 *
 * This module exports all type definitions used throughout the application:
 * - JSON-RPC types for MCP protocol communication
 * - Tool configuration interfaces
 * - API types for TagoIO resources
 * - Error types (future)
 */

export type { JSONRPCRequest, JSONRPCSuccess, JSONRPCError } from './jsonrpc.js';
export type { IToolConfig, IDeviceToolConfig } from './tools.js';

// Export all API types and schemas
export * from './api/index.js';

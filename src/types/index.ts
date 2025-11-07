/**
 * Centralized type definitions for the MCP server.
 *
 * This module exports all type definitions used throughout the application:
 * - JSON-RPC types for MCP protocol communication
 * - Tool configuration interfaces
 * - API types (future)
 * - Error types (future)
 */

export type { JSONRPCRequest, JSONRPCSuccess, JSONRPCError } from './jsonrpc.js';
export type { IToolConfig, IDeviceToolConfig } from './tools.js';

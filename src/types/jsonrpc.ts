/**
 * JSON-RPC 2.0 type definitions for MCP protocol communication.
 */

/**
 * JSON-RPC Request structure
 */
interface JSONRPCRequest {
    jsonrpc: '2.0';
    method: string;
    params?: Record<string, unknown> | unknown[];
    id?: string | number | null;
}

/**
 * JSON-RPC Success Response structure
 */
interface JSONRPCSuccess {
    jsonrpc: '2.0';
    result: unknown;
    id: string | number | null;
}

/**
 * JSON-RPC Error Response structure
 */
interface JSONRPCError {
    jsonrpc: '2.0';
    error: {
        code: number;
        message: string;
        data?: unknown;
    };
    id: string | number | null;
}

export type { JSONRPCRequest, JSONRPCSuccess, JSONRPCError };

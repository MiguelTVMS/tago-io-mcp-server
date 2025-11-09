# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for TagoIO, enabling AI models to interact with TagoIO accounts for device management, data analysis, and platform integration. The server is built with TypeScript and uses the MCP SDK to provide tools for accessing TagoIO resources.

## Tooling and Runtime

- Node.js 24 LTS (devcontainer base image `mcr.microsoft.com/devcontainers/javascript-node:24-bookworm`).
- TypeScript 5.9 with `module`/`moduleResolution` set to `NodeNext`.
- Zod 3.x for configuration validation (the MCP SDK currently expects Zod 3 APIs).
- Biome 1.9 for linting and formatting (`biome.json`).

## Environment Variables

Reference `.env.example`. Primary variables:

### TagoIO Configuration

- `TAGOIO_TOKEN` - (required) TagoIO Profile or Analysis token.
- `TAGOIO_API` - (default: `https://api.us-e1.tago.io`) TagoIO API endpoint.

### MCP Generic Server Configuration

- `MCP_SERVER_LOG_LEVEL` (default: `info`) - logging verbosity (`debug`, `info`, `warn`, `error`).
- `MCP_SERVER_LOG_FORMAT` (default: `plain`) - log output format (`plain`,`json`, or `gcp-json`).
  - `plain` - human-readable text format.
  - `json` - structured JSON format.
  - `gcp-json` - structured JSON format compatible with Google Cloud Logging.
- `MCP_SERVER_USE_HTTP` (default: `false`) - whether to start the HTTP server instead of stdio.
- `MCP_SERVER_STATEFUL` (default: `false`) - whether to maintain stateful sessions per client.

### MCP Server HTTP Configuration, if `MCP_SERVER_USE_HTTP` is `true`

- `MCP_HTTP_TRANSPORT` (default: `stream`) - HTTP transport protocol (`stream` for Streamable HTTP per MCP 2025-06-18 spec, `sse` for Server-Sent Events per MCP 2024-11-05 spec).
- `MCP_HTTP_PORT` (default: `3000`) - port for the HTTP server.
- `MCP_HTTP_HOST` (default: `0.0.0.0`) - host for the HTTP server (deprecated, use `MCP_HTTP_BIND_ADDR` instead).
- `MCP_HTTP_PATH` - base path for MCP HTTP endpoints. Defaults to `/mcp` for `stream` transport and `/sse` for `sse` transport if not specified.
- `MCP_HTTP_BIND_ADDR` (default: `127.0.0.1`) - network bind address (IPv4 or IPv6) for security. Defaults to loopback for local-only access.
- `MCP_HTTP_ENABLE_HEALTHCHECK` (default: `true`) - enable a healthcheck endpoint at the path indicated on `MCP_HTTP_HEALTHCHECK_PATH`.
- `MCP_HTTP_HEALTHCHECK_PATH` (default: `/healthz`) - path for the healthcheck endpoint.
- `MCP_HTTP_ALLOW_CORS` (default: `true`) - enable CORS for the HTTP server.
- `MCP_HTTP_ALLOWED_ORIGINS` (default: `127.0.0.1,localhost`) - comma-separated list of allowed origins for DNS rebinding protection. Must be valid hostnames, IPv4, or IPv6 addresses. Required for security.
- `MCP_HTTP_NGROK_ENABLED` (default: `false`) - whether to use ngrok to expose the HTTP server publicly. Works with both `stream` and `sse` transports.
- `MCP_HTTP_NGROK_AUTH_TOKEN` (optional) - ngrok auth token, required if `MCP_HTTP_NGROK_ENABLED` is `true`.

## Code Structure

- `src/index.ts` — MCP Server startup, including both stdio and HTTP server initialization. The type of server is selected based on environment variables.
- `src/config.ts` — Environment variable loading and validation via Zod.
- `src/utils/` — Utility functions (e.g., logger, error handling).
- `src/tagoClient/` — Tago.IO API interaction layer, organized by API tag (e.g., `src/tagoClient/user.ts`, `src/tagoClient/device.ts`). The main client class is in `src/tagoClient/index.ts`.
- `src/server/` — Code for each implementation of the MCP server:
  - `src/server/stdio.ts` - stdio transport implementation
  - `src/server/http.ts` - HTTP transport router (delegates to sse.ts or stream.ts)
  - `src/server/http-common.ts` - shared HTTP server logic (Express, CORS, health checks, ngrok)
  - `src/server/sse.ts` - Server-Sent Events transport (MCP 2024-11-05 spec)
  - `src/server/stream.ts` - Streamable HTTP transport (MCP 2025-06-18 spec)
  - `src/server/common.ts` - shared server utilities (SERVER_INFO, tool registration)
- `src/types/` - centralized type definitions (API, MCP, errors)
- `src/tools/` - individual MCP tool files and registration.
- `src/prompts/` - individual MCP prompt files and registration.
- `src/resources/` — individual MCP resource files and registration.
- `tests/` — Unit and integration tests. The internal folder structure mirrors `src/` e.g. `tests/utils/logger.test.ts`.

## Development Workflow

- Install dependencies: `npm install` (runs automatically on container create).
- Development server: `npm run dev` (tsx watcher).
- Build: `npm run build` (emits to `dist/`).
- Lint and format: `npm run check` (Biome linting and formatting).
- Fix issues: `npm run lint:fix` (auto-fixes formatting and some linting issues).
- Launch configurations are available under `.vscode/launch.json` for debugging.

## Contribution Guidelines

- Keep environment secrets out of the repo; only commit `.env.example`.
- Ensure `npm run check` and `npm run build` pass before committing.
- Reference the OpenAPI spec in `docs/` when adding or updating TagoIO API interactions.

## Formatting & Linting

- Biome handles both linting and formatting (`npm run check`).
- Configuration in `biome.json` with 2-space indentation, single quotes, 100-char line width.
- `noExplicitAny` configured as warning (not error) for gradual type improvements.

## Aditional Guidelines

- The project follows a GitFlow branching strategy: `main` reflects production-ready code, while `develop` is the integration branch. **All pull requests must target `develop`.**
- When adding new features or fixing bugs, create a new branch from `develop` and submit a pull request for review.
- Write unit tests for new functionality and ensure existing tests pass.
- Keep the reference `.env.example` and this documentation up to date with any new environment variables added to the project.
- **ONLY** implement using client credentials mode Access processs as described in the TagoIO API documentation. The client credentials should be provided via environment variables.
- After a tool or prompt is implemented, update the README.md file with a table of supported tools and prompts in the topic Supported TagoIO API Operations. This table should include the operationId, a brief description, and any relevant notes about the implementation. Keep it short and concise.
- **DON'T** change anything in `node_modules` or commit any changes to that folder.
- IMPORTANT: Encapsulate the log implementation in `src/utils/logger.ts` to allow easy modification of the logging behavior in the future. Use this logger throughout the codebase instead of direct console.log statements. The logger adapts based on the mode: when `MCP_SERVER_USE_HTTP=false` (stdio mode), logs go to stderr to avoid interleaving with the MCP output; when `MCP_SERVER_USE_HTTP=true` (HTTP mode), logs go to stdout for standard output.
- Avoid using the TypeScript `any` type; prefer precise typings or `unknown` when necessary.
- Any new HTTP transport implementation should be done in both `src/server/sse.ts` and `src/server/stream.ts` to maintain feature parity between transports.
- **DON'T** use `process.env.` to access environment variables directly. Access should be done outside of `src/config.ts`. All environment variables must be loaded and validated there using Zod, and then imported where needed.
- **Configuration validations** should be extracted to `src/utils/config-validations.ts`. No validation logic should exist outside of `src/config.ts` and `src/utils/config-validations.ts`. This includes validations for IP addresses, hostnames, origins, and any other configuration-related validation.
- Tests should only reside in the `tests/` folder. **DON'T** add test files alongside source files in `src/`.
- **Test folder structure MUST mirror the `src/` folder structure.** For example, tests for `src/utils/logger.ts` should be in `tests/utils/logger.test.ts`, and tests for `src/server/http.ts` should be in `tests/server/http.test.ts`.

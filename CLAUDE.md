# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for TagoIO, enabling AI models to interact with TagoIO accounts for device management, data analysis, and platform integration. The server is built with TypeScript and uses the MCP SDK to provide tools for accessing TagoIO resources.

## Tooling and Runtime

- Node.js 24 LTS (devcontainer base image `mcr.microsoft.com/devcontainers/javascript-node:24-bookworm`).
- TypeScript 5.9 with `module`/`moduleResolution` set to `NodeNext`.
- Zod 3.x for configuration validation (the MCP SDK currently expects Zod 3 APIs).
- ESLint 9 using the flat config (`eslint.config.js`), plus Prettier 3.

## Environment Variables

Reference `.env.example`. Primary variables:

### TagoIO Configuration:

- `TAGOIO_TOKEN` - (required) TagoIO Profile or Analysis token.
- `TAGOIO_API` - (default: `https://api.us-e1.tago.io`) TagoIO API endpoint.

### MCP Generic Server Configuration:

- `MCP_SERVER_LOG_LEVEL` (default: `info`) - logging verbosity (`debug`, `info`, `warn`, `error`).
- `MCP_SERVER_LOG_FORMAT` (default: `plain`) - log output format (`plain`,`json`, or `gcp-json`).
  - `plain` - human-readable text format.
  - `json` - structured JSON format.
  - `gcp-json` - structured JSON format compatible with Google Cloud Logging.
- `MCP_SERVER_USE_HTTP` (default: `false`) - whether to start the HTTP server instead of stdio.
- `MCP_SERVER_STATEFUL` (default: `false`) - whether to maintain stateful sessions per client.

### MCP Server HTTP Configuration, if `MCP_SERVER_USE_HTTP` is `true`:

- `MCP_HTTP_PORT` (default: `3000`) - port for the HTTP/SSE server.
- `MCP_HTTP_HOST` (default: `0.0.0.0`) - host for the HTTP/SSE server.
- `MCP_HTTP_PATH` (default: `/mcp`) - base path for MCP HTTP endpoints.
- `MCP_HTTP_ENABLE_HEALTHCHECK` (default: `true`) - enable a healthcheck endpoint at the path indicated on `MCP_HTTP_HEALTHCHECK_PATH`.
- `MCP_HTTP_HEALTHCHECK_PATH` (default: `/healthz`) - path for the healthcheck endpoint.
- `MCP_HTTP_ALLOW_CORS` (default: `true`) - enable CORS for the HTTP server.
- `MCP_HTTP_ALLOWED_HOSTS` (optional) - comma-separated list of allowed hosts for requests.
- `MCP_HTTP_ALLOWED_ORIGINS` (optional) - comma-separated list of allowed origins for CORS.
- `MCP_HTTP_NGROK_ENABLED` (default: `false`) - whether to use ngrok to expose the HTTP server publicly.
- `MCP_HTTP_NGROK_AUTH_TOKEN` (optional) - ngrok auth token, required if `MCP_HTTP_NGROK_ENABLED` is `true`.

## Code Structure

- `src/index.ts` — MCP Server startup, including both stdio and HTTP server initialization. The type of server is selected based on environment variables.
- `src/config.ts` — Environment variable loading and validation via Zod.
- `src/utils/` — Utility functions (e.g., logger, error handling).
- `src/tagoClient/` — Tago.IO API interaction layer, organized by API tag (e.g., `src/tagoClient/user.ts`, `src/tagoClient/device.ts`). The main client class is in `src/tagoClient/index.ts`.
- `src/server/` — Code for each implementation of the MCP server e.g. `src/server/http.ts`, `src/server/stdio.ts`. Any common server logic goes into `src/server/common.ts`.
- `src/types/` - centralized type definitions (API, MCP, errors)
- `src/tools/` - individual tool files and registration.
- `src/prompts/` - individual prompt files and registration.
- `tests/` — Unit and integration tests.

## Development Workflow

- Install dependencies: `npm install` (runs automatically on container create).
- Development server: `npm run dev` (tsx watcher).
- Build: `npm run build` (emits to `dist/`).
- Lint: `npm run check` (ESLint flat config and Prettier).
- Launch configurations are available under `.vscode/launch.json` for debugging.

## Contribution Guidelines

- Keep environment secrets out of the repo; only commit `.env.example`.
- Ensure `npm run lint` and `npm run build` pass before committing.
- Reference the OpenAPI spec in `docs/` when adding or updating TagoIO API interactions.

## Formatting & Linting

- Follow Prettier defaults (`npm run format`).
- ESLint enforces import ordering and TypeScript best practices.

## Aditional Guidelines

- The project follows a GitFlow branching strategy: `main` reflects production-ready code, while `develop` is the integration branch. **All pull requests must target `develop`.**
- When adding new features or fixing bugs, create a new branch from `develop` and submit a pull request for review.
- Write unit tests for new functionality and ensure existing tests pass.
- Keep the reference `.env.example` and this documentation up to date with any new environment variables added to the project.
- **ONLY** implement using client credentials mode Access processs as described in the TagoIO API documentation. The client credentials should be provided via environment variables.
- After a tool or prompt is implemented, update the README.md file with a table of supported tools and prompts in the topic Supported TagoIO API Operations. This table should include the operationId, a brief description, and any relevant notes about the implementation. Keep it short and concise.
- **DON'T** change anything in `node_modules` or commit any changes to that folder.
- IMPORTANT: Encapsulate the log implementation in `src/utils/logger.ts` to allow easy modification of the logging behavior in the future. Use this logger throughout the codebase instead of direct console.log statements. The logger when in stdio mode should log only to stderr to avoid interleaving with the MCP output.
- Avoid using the TypeScript `any` type; prefer precise typings or `unknown` when necessary.
- Any new implementation should be done in both servers, http server and stdio server, to maintain feature parity.
- **DON'T** use `process.env.` to access environment variables directly. Access should be done outside of `src/config.ts`. All environment variables must be loaded and validated there using Zod, and then imported where needed.

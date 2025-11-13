# TagoIO | MCP Server

The TagoIO MCP Server enables AI models to interact directly with your TagoIO account, providing contextual access to devices, data, and platform resources for enhanced development workflows and intelligent data analysis.

## Features

- **Device Management**: Access device information, configurations, and real-time data
- **Data Analysis**: Perform statistical operations (sums, averages, reports) on stored data
- **Platform Integration**: Retrieve users, actions, analysis scripts, entities, and account statistics
- **Code Generation**: AI-powered TagoIO Analysis script generation with proper context
- **Documentation Search**: Access TagoIO documentation and code examples
- **Development Support**: Debug assistance and platform integration guidance

## Quick Start

### Prerequisites

- Docker and Docker Compose installed (<https://docs.docker.com/get-docker/>)
- TagoIO account with valid profile token or analysis token
- Compatible AI platform or IDE (see [Platform-Specific Setup](#platform-specific-setup))

### Installation

#### Docker Deployment (Recommended)

The recommended way to run the TagoIO MCP Server is using the pre-built Docker image:

```bash
docker run -d \
  --name tago-mcp-server \
  -e TAGOIO_TOKEN="your-token-here" \
  -e TAGOIO_API="https://api.us-e1.tago.io" \
  -p 3000:3000 \
  ghcr.io/migueltvms/tago-io-mcp-server:latest
```

**Configuration via Environment Variables:**

- `TAGOIO_TOKEN` - Your TagoIO authentication token (required)
- `TAGOIO_API` - API endpoint (use `https://api.eu-w1.tago.io` for European accounts)
- `MCP_SERVER_USE_HTTP` - Set to `true` to enable HTTP server mode
- `MCP_SERVER_LOG_LEVEL` - Set logging level (debug, info, warn, error)

**View logs:**

```bash
docker logs -f tago-mcp-server
```

**Stop container:**

```bash
docker stop tago-mcp-server
docker rm tago-mcp-server
```

#### Building from Source (For Development)

If you want to customize or develop the server:

1. Clone the repository:

   ```bash
   git clone https://github.com/MiguelTVMS/tago-io-mcp-server.git
   cd tago-io-mcp-server
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   # Edit .env and set your TAGOIO_TOKEN
   ```

3. Run with Docker Compose:

   ```bash
   npm run docker:run
   ```

**Available Docker Commands:**

- `npm run docker:build` - Build production image
- `npm run docker:run` - Start container
- `npm run docker:stop` - Stop container
- `npm run docker:logs` - View container logs

#### Docker with MCP Configuration (Alternative)

For AI platforms that support Docker in MCP configuration:

```json
{
  "mcpServers": {
    "tago-io": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TAGOIO_TOKEN=YOUR-TOKEN",
        "-e",
        "TAGOIO_API=https://api.us-e1.tago.io",
        "ghcr.io/migueltvms/tago-io-mcp-server:latest"
      ]
    }
  }
}
```

#### NPM/NPX Installation (Alternative)

For direct integration with AI platforms using NPM:

```json
{
  "mcpServers": {
    "@tago-io/mcp": {
      "command": "npx",
      "args": ["-y", "@tago-io/mcp-server"],
      "env": {
        "TAGOIO_TOKEN": "YOUR-TOKEN",
        "TAGOIO_API": "https://api.us-e1.tago.io"
      }
    }
  }
}
```

**Configuration Parameters:**

- Replace `YOUR-TOKEN` with your TagoIO Profile token or Analysis Token
  - **Analysis Token** (recommended): Better security with limited permissions. Set your analysis to run "External" to use the token.
  - **Profile Token**: Grants full profile access. Not recommended for production.
- Update API endpoint to `https://api.eu-w1.tago.io` for European accounts

### Platform-Specific Setup

#### Claude Desktop

1. Download and install Claude Desktop
2. Copy the NPM/NPX configuration from above
3. Send the prompt: _"Hey Claude, install the following MCP Server"_ with the configuration
4. Claude will automatically install and configure the server

#### Development IDEs

For IDEs like Cursor, Windsurf, Cline, and VS Code, place the NPM configuration file in the appropriate location:

| Platform           | Configuration Path                    |
| ------------------ | ------------------------------------- |
| **Cursor**         | `~/.cursor/mcp.json`                  |
| **Windsurf**       | `~/.codeium/windsurf/mcp_config.json` |
| **Cline**          | `~/.cline/mcp_config.json`            |
| **Claude Desktop** | `~/.claude/mcp_config.json`           |

After adding the configuration, restart your IDE to load the MCP server.

## Authentication

The MCP server requires a TagoIO token for authentication. You can use either:

### Profile Token (Full Access)

1. Log into your TagoIO account
2. Navigate to **Account Settings** → **Profile Tokens**
3. Generate a new token with appropriate permissions
4. Add it to your `.env` file or configuration

### Analysis Token (Recommended for Security)

1. Create an Analysis in TagoIO
2. Set the analysis to run **"External"**
3. Generate a token for the analysis
4. Add it to your `.env` file or configuration

**Security Notes:**

- Keep your tokens secure and never commit them to version control
- Analysis tokens provide better security through limited permissions
- Use `.env` file for Docker deployments
- Tokens are validated on server startup

## Configuration

The server supports extensive configuration through environment variables:

### Required Configuration

- `TAGOIO_TOKEN` - Your TagoIO authentication token (required)
- `TAGOIO_API` - API endpoint (defaults to US region)

### MCP Server Configuration

- `MCP_SERVER_LOG_LEVEL` - Logging verbosity (debug, info, warn, error)
- `MCP_SERVER_LOG_FORMAT` - Log format (plain, json, gcp-json)
- `MCP_SERVER_USE_HTTP` - Enable HTTP server mode (default: false)
- `MCP_SERVER_STATEFUL` - Maintain stateful sessions (default: false)

### HTTP Server Configuration (when enabled)

- `MCP_HTTP_PORT` - Server port (default: 3000)
- `MCP_HTTP_HOST` - Server host (default: 0.0.0.0)
- `MCP_HTTP_PATH` - Base path for endpoints (default: /mcp)
- `MCP_HTTP_ENABLE_HEALTHCHECK` - Enable health endpoint (default: true)
- `MCP_HTTP_ALLOW_CORS` - Enable CORS (default: true)
- `MCP_HTTP_NGROK_ENABLED` - Use ngrok for public access (default: false)

See `.env.example` for complete configuration options.

## Supported TagoIO API Operations

The server provides comprehensive access to TagoIO resources through organized API operations:

### Core Resources

- **Devices** - CRUD operations, data management, configuration, tokens
- **Actions** - Automation workflows and triggers
- **Analysis** - Serverless code execution environments
- **Entities** - Next-generation database system

### Platform Integration

- **Connectors & Networks** - Integration configurations
- **Users** - TagoRUN user management
- **Profiles** - Account information and usage metrics
- **Secrets** - Secure credential storage

### Documentation & Code

- **Documentation Search** - Access TagoIO docs and examples
- **Code Search** - Find Analysis scripts and Payload Parsers

All operations are exposed through the MCP protocol for AI model interaction.

## Regional Endpoints

The server supports both US and European TagoIO instances:

- **US East**: `https://api.us-e1.tago.io` (default)
- **EU West**: `https://api.eu-w1.tago.io`

Configure via `TAGOIO_API` environment variable.

## Development

For local development:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint and format
npm run check
npm run lint:fix
```

## Troubleshooting

### Common Issues

#### Docker Container Won't Start

- Verify `.env` file exists and contains valid `TAGOIO_TOKEN`
- Check logs: `npm run docker:logs`
- Ensure port 3000 isn't already in use (if HTTP mode enabled)

#### Authentication Error

- Confirm token validity in TagoIO dashboard
- Verify token has necessary permissions
- For Analysis tokens, ensure analysis is set to run "External"

#### Connection Failed

- Check `TAGOIO_API` matches your account region
- Verify network connectivity to TagoIO API
- Review firewall rules if running in restricted environment

#### Data Access Issues

- Verify device permissions in TagoIO account
- Ensure devices have recent data available
- Check token permissions for requested resources

### Docker Debugging

```bash
# Check container status
docker ps -a

# View detailed logs
npm run docker:logs

# Access container shell
docker exec -it tago-mcp-server sh

# Restart container
npm run docker:stop
npm run docker:run
```

### Getting Help

- Review error messages in logs carefully
- Check TagoIO documentation: <https://docs.tago.io>
- Open an issue on GitHub with logs and configuration (remove sensitive data)

## Architecture

The server is organized into modular components:

- **`src/tagoClient/`** - TagoIO SDK client wrapper and API operations
- **`src/tagoClient/api/`** - Organized API operations by resource type
- **`src/tools/`** - MCP tool implementations for AI interaction
- **`src/types/`** - Centralized type definitions and schemas
- **`src/types/api/`** - API-specific type definitions by domain
- **`src/utils/`** - Shared utilities and helpers
- **`src/server/`** - MCP server implementations (stdio and HTTP)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

This repository is based on the original work from [tago-io/mcp-server](https://github.com/tago-io/mcp-server), created and maintained by:

- [@vitorfdl](https://github.com/vitorfdl)
- [@bgelatti](https://github.com/bgelatti)
- [@mateuscardosodeveloper](https://github.com/mateuscardosodeveloper)
- [@cotrin](https://github.com/cotrin)

---

**Need Help?** Visit the [TagoIO Documentation](https://docs.tago.io) or open an issue on GitHub.

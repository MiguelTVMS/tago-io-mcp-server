<br/>
<p align="center">
  <img src="https://assets.tago.io/tagoio/tagoio.png" width="250px" alt="TagoIO"></img>
</p>

# TagoIO | MCP Server

The TagoIO MCP Server enables AI models to interact directly with your TagoIO account, providing contextual access to devices, data, and platform resources for enhanced development workflows and intelligent data analysis.

## Features

- **Device Management**: Access device information, configurations, and real-time data
- **Data Analysis**: Perform statistical operations (sums, averages, reports) on stored data
- **Platform Integration**: Retrieve users, actions, analysis scripts, and account statistics
- **Code Generation**: AI-powered TagoIO Analysis script generation with proper context
- **Development Support**: Debug assistance and tag relationship analysis

## Quick Start

### Prerequisites

- Installed Node.js 18+ (<https://nodejs.org/en/download/>)
- TagoIO account with valid profile token or analysis token
- Compatible AI platform or IDE (see [Supported Platforms](#supported-platforms))

### Installation

#### Manual Configuration

Create or update your MCP configuration file:

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

- Replace `YOUR-TOKEN` with your TagoIO Profile token or an Analysis Token
  - Using an Analysis token is recommended for better security, as you can limit the token's permissions to only the resources you need. Your analysis must be set to run "External" so you can use the token.
  - Using a Profile token is going to instantly grant the MCP access to your entire profile, but it's not recommended for production environments.
- Update API endpoint to `https://api.eu-w1.tago.io` for European accounts

### Platform-Specific Setup

#### Claude Desktop

1. Download and install Claude Desktop
2. Copy the MCP configuration above
3. Send the prompt: _"Hey Claude, install the following MCP Server"_ with the configuration
4. Claude will automatically install and configure the server

#### One-Click Install for Development IDEs

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=%40tago-io%2Fmcp&config=eyJjb21tYW5kIjoibnB4IC15IEB0YWdvLWlvL21jcC1zZXJ2ZXIiLCJlbnYiOnsiVEFHT0lPX1RPS0VOIjoiWU9VUi1QUk9GSUxFLVRPS0VOIiwiVEFHT0lPX0FQSSI6Imh0dHBzOi8vYXBpLnVzLWUxLnRhZ28uaW8ifX0%3D)

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=%40tago-io%2Fmcp&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40tago-io%2Fmcp-server%22%5D%2C%22env%22%3A%7B%22TAGOIO_TOKEN%22%3A%22%24%7Binput%3AtagoToken%7D%22%2C%22TAGOIO_API%22%3A%22https%3A%2F%2Fapi.us-e1.tago.io%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22tagoToken%22%2C%22description%22%3A%22TagoIO%20Profile%20Token%22%2C%22password%22%3Atrue%7D%5D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=%40tago-io%2Fmcp&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40tago-io%2Fmcp-server%22%5D%2C%22env%22%3A%7B%22TAGOIO_TOKEN%22%3A%22%24%7Binput%3AtagoToken%7D%22%2C%22TAGOIO_API%22%3A%22https%3A%2F%2Fapi.us-e1.tago.io%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22tagoToken%22%2C%22description%22%3A%22TagoIO%20Profile%20Token%22%2C%22password%22%3Atrue%7D%5D&quality=insiders)

Or place the configuration file in the appropriate location for your IDE and restart the application.

| Platform           | Configuration Path                    |
| ------------------ | ------------------------------------- |
| **Cursor**         | `~/.cursor/mcp.json`                  |
| **Windsurf**       | `~/.codeium/windsurf/mcp_config.json` |
| **Cline**          | `~/.cline/mcp_config.json`            |
| **Claude Desktop** | `~/.claude/mcp_config.json`           |

## Authentication

The MCP server requires a **TagoIO Profile Token** for authentication:

1. Log into your TagoIO account
2. Navigate to **Account Settings** → **Profile Tokens**
3. Generate a new token with appropriate permissions
4. Replace `YOUR-PROFILE-TOKEN` in the configuration

**Security Note**: Keep your profile token secure and never commit it to version control.

## HTTP Server Mode

The MCP server can run in HTTP mode, allowing remote access and integration with web-based AI clients. This mode supports two transport protocols:

### Transport Protocols

1. **Streamable HTTP** (default, recommended) - [MCP 2025-06-18 Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
   - Bidirectional streaming over SSE
   - Supports both stateful and stateless modes
   - Modern protocol with better features

2. **Server-Sent Events (SSE)** - [MCP 2024-11-05 Specification](https://modelcontextprotocol.io/specification/2024-11-05/basic/transports)
   - Server-to-client via SSE, client-to-server via POST
   - Session-based communication
   - Legacy protocol for compatibility

### Configuration

Set `MCP_SERVER_USE_HTTP=true` in your `.env` file to enable HTTP mode:

```bash
# Enable HTTP server
MCP_SERVER_USE_HTTP=true

# Choose transport protocol (stream or sse)
MCP_HTTP_TRANSPORT=stream

# Bind address (defaults to 127.0.0.1 for local-only access)
MCP_HTTP_BIND_ADDR=127.0.0.1

# Port configuration
MCP_HTTP_PORT=3000

# Endpoint path (defaults based on transport)
# - /mcp for stream transport
# - /sse for sse transport
MCP_HTTP_PATH=/mcp
```

### Security Features

The HTTP server includes security protections against DNS rebinding attacks:

- **Origin Validation**: Validates the `Origin` header on all connections
- **Network Binding**: Binds to loopback address (127.0.0.1) by default for local-only access
- **Allowed Origins**: Configure `MCP_HTTP_ALLOWED_ORIGINS` with comma-separated list of trusted origins

```bash
# Security configuration
MCP_HTTP_ALLOWED_ORIGINS=127.0.0.1,localhost
MCP_HTTP_BIND_ADDR=127.0.0.1
```

### Public Access with ngrok

For development or remote access, you can expose the server publicly using ngrok:

```bash
# Enable ngrok tunnel
MCP_HTTP_NGROK_ENABLED=true
MCP_HTTP_NGROK_AUTH_TOKEN=your_ngrok_auth_token_here
```

The ngrok tunnel works with both transport protocols and provides a public URL for accessing your MCP server.

**Warning**: When exposing your server publicly, ensure your TagoIO token has minimal required permissions and consider using an Analysis token instead of a Profile token.

### API Endpoints

For more information about the transport protocols and their implementation, see:
- [Streamable HTTP Transport Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
- [SSE Transport Specification](https://modelcontextprotocol.io/specification/2024-11-05/basic/transports)

## Docker Deployment

For containerized deployments, you can use the provided Docker configuration:

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/MiguelTVMS/tago-io-mcp-server.git
cd tago-io-mcp-server

# Set up environment
cp .env.example .env
# Edit .env and set your TAGOIO_TOKEN

# Run with Docker Compose
npm run docker:run

# View logs
npm run docker:logs
```

### Docker Images

- **Production**: `ghcr.io/migueltVMS/tago-io-mcp-server:latest`
- **Development**: `ghcr.io/migueltVMS/tago-io-mcp-server:dev`

For detailed Docker deployment instructions, see [DOCKER.md](DOCKER.md).

## API Endpoints

The server supports both US and European TagoIO instances:

- **US East**: `https://api.us-e1.tago.io` (default)
- **EU West**: `https://api.eu-w1.tago.io`

## Troubleshooting

### Common Issues

**Connection Failed**

- Check your profile token validity
- Ensure correct API endpoint for your region

**Authentication Error**

- Confirm profile or analysis token has necessary permissions
- Verify token format in configuration file

**Data Access Issues**

- Check device permissions in your TagoIO account
- Ensure devices have recent data available

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

This repository is based on the original work from [tago-io/mcp-server](https://github.com/tago-io/mcp-server), created and maintained by:

- [@vitorfdl](https://github.com/vitorfdl)
- [@bgelatti](https://github.com/bgelatti)
- [@mateuscardosodeveloper](https://github.com/mateuscardosodeveloper)
- [@cotrin](https://github.com/cotrin)

---

**Need Help?** Visit the [TagoIO Documentation](https://docs.tago.io).

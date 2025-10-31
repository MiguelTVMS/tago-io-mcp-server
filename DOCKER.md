# Docker Deployment Guide

This document explains how to run the TagoIO MCP Server in Docker containers.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- TagoIO API token (Profile or Analysis token)

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and set your TagoIO token:

```env
TAGOIO_TOKEN=your_tagoio_token_here
TAGOIO_API=https://api.us-e1.tago.io
LOG_LEVEL=INFO
```

### 2. Production Deployment

Build and run the production container:

```bash
# Build the image
docker-compose build

# Run the container
docker-compose up -d

# View logs
docker-compose logs -f tago-mcp-server

# Stop the container
docker-compose down
```

### 3. Development Deployment

For development with hot reload:

```bash
# Build and run development container
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f tago-mcp-server-dev

# Stop the container
docker-compose -f docker-compose.dev.yml down
```

## Docker Images

### Production Image (Dockerfile)

- **Base**: `node:20-alpine`
- **Size**: ~200MB
- **Features**:
  - Multi-stage build for smaller image
  - Non-root user for security
  - Production dependencies only
  - Built application (no source code)
  - Signal handling with dumb-init

### Development Image (Dockerfile.dev)

- **Base**: `node:20-alpine`
- **Size**: ~300MB
- **Features**:
  - All dependencies (including dev dependencies)
  - Source code mounted as volumes
  - Hot reload with ts-node-dev
  - Debug logging enabled

## Container Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TAGOIO_TOKEN` | Yes | - | TagoIO Profile or Analysis token |
| `TAGOIO_API` | No | `https://api.us-e1.tago.io` | TagoIO API endpoint |
| `LOG_LEVEL` | No | `INFO` | Logging level (DEBUG, INFO, WARN, ERROR) |
| `NODE_ENV` | No | `production` | Node.js environment |

### Resource Limits

#### Production
- **Memory**: 512MB limit, 256MB reservation
- **CPU**: 0.5 cores limit, 0.25 cores reservation

#### Development
- **Memory**: 1GB limit, 512MB reservation
- **CPU**: 1.0 cores limit, 0.5 cores reservation

### Health Checks

Both containers include health checks that run every 30 seconds:
- **Test**: Simple Node.js process check
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start Period**: 40 seconds

## Usage with MCP Clients

Since this is an MCP server that typically uses stdio transport, you'll need to configure your MCP client to connect to the containerized server.

### Example Client Configuration

For clients that support Docker containers, you might configure:

```json
{
  "servers": {
    "tago-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "--env-file", ".env",
        "tago-mcp-server:latest"
      ]
    }
  }
}
```

## Monitoring and Logging

### View Container Logs

```bash
# Production logs
docker-compose logs -f tago-mcp-server

# Development logs
docker-compose -f docker-compose.dev.yml logs -f tago-mcp-server-dev

# Follow logs with timestamps
docker-compose logs -f -t tago-mcp-server
```

### Container Status

```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats tago-mcp-server
```

### Health Check Status

```bash
# Check health status
docker inspect tago-mcp-server --format='{{.State.Health.Status}}'

# View health check history
docker inspect tago-mcp-server --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

## Building Custom Images

### Build Production Image

```bash
docker build -t tago-mcp-server:latest .
```

### Build Development Image

```bash
docker build -f Dockerfile.dev -t tago-mcp-server:dev .
```

### Build with Custom Tags

```bash
# Build with version tag
docker build -t tago-mcp-server:v2.0.1 .

# Build for specific platform
docker build --platform linux/amd64 -t tago-mcp-server:latest .
```

## Troubleshooting

### Common Issues

1. **Container exits immediately**
   - Check that `TAGOIO_TOKEN` is set in `.env`
   - Verify token has proper permissions
   - Check logs: `docker-compose logs tago-mcp-server`

2. **Permission denied errors**
   - Ensure the non-root user has proper permissions
   - Check file ownership in mounted volumes

3. **Out of memory errors**
   - Increase memory limits in docker-compose.yml
   - Monitor memory usage with `docker stats`

4. **Hot reload not working (dev)**
   - Ensure source files are properly mounted
   - Check that ts-node-dev is running correctly

### Debug Mode

Enable debug logging by setting environment variables:

```bash
# In .env file
LOG_LEVEL=DEBUG
NODE_ENV=dev
```

Or directly in docker-compose:

```bash
docker-compose run --rm -e LOG_LEVEL=DEBUG tago-mcp-server
```

## Security Considerations

- Uses non-root user (`mcp:nodejs`)
- Minimal Alpine Linux base image
- Production image excludes source code and dev dependencies
- Environment variables for sensitive data
- Resource limits prevent resource exhaustion
- Regular security updates via base image updates

## Maintenance

### Update Dependencies

Rebuild images after updating package.json:

```bash
docker-compose build --no-cache
```

### Clean Up

Remove unused Docker resources:

```bash
# Remove stopped containers
docker-compose down

# Remove images
docker rmi tago-mcp-server:latest

# Clean up system
docker system prune -f
```
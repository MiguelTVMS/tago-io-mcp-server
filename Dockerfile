# Use Node.js 20 Alpine as base image for smaller size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies and source files
RUN rm -rf src tsconfig.json vitest.config.ts && \
    rm -rf node_modules && \
    npm ci --only=production && \
    npm cache clean --force

# Change ownership to non-root user
RUN chown -R mcp:nodejs /app
USER mcp

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=INFO

# Expose port (if needed for health checks or metrics)
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the MCP server
CMD ["node", "build/index.js"]
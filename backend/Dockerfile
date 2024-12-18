# Use Node.js Alpine-based image for smaller size
FROM node:18-alpine

# Install build dependencies for potential native modules
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create logs directory for production logging
RUN mkdir -p logs && chown -R node:node logs

# Use non-root user for security
USER node

# Expose port
EXPOSE 3000

# Add startup script
COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command
CMD ["npm", "start"]
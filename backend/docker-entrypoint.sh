#!/bin/sh

echo "Starting Object Finder Backend Service"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment: ${NODE_ENV:-development}"

# Execute CMD
exec "$@"
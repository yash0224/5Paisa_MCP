#!/usr/bin/env node

import { MCPServer } from "mcp-framework";

const server = new MCPServer();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

// Prevent the process from exiting
process.stdin.resume();

server.start();
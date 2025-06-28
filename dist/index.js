#!/usr/bin/env node
import { MCPServer } from "mcp-framework";
const server = new MCPServer();
// Solution 1: Use async/await to keep the process alive
async function startServer() {
    try {
        await server.start();
        console.log('MCP Server started successfully');
        // Keep the process alive
        process.on('SIGINT', () => {
            console.log('Received SIGINT, shutting down gracefully...');
            server.stop();
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            console.log('Received SIGTERM, shutting down gracefully...');
            server.stop();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
// Alternative Solution 2: If server.start() doesn't return a promise
// server.start();
// 
// // Keep the process alive with an interval
// setInterval(() => {
//   // Empty interval to prevent exit
// }, 60000);
// 
// process.on('SIGINT', () => {
//   console.log('Received SIGINT, shutting down gracefully...');
//   server.stop();
//   process.exit(0);
// });
// Alternative Solution 3: Listen for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    server.stop();
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.stop();
    process.exit(1);
});

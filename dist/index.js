#!/usr/bin/env node
import { MCPServer } from "mcp-framework";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = new MCPServer();
// Keep process alive
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});
// Start with SSE transport on port 8080
async function startServer() {
    try {
        const transport = new SSEServerTransport("/message", server);
        // Start HTTP server
        await transport.start({
            port: 8080,
            host: '0.0.0.0'
        });
        console.log('🚀 MCP Server running on http://localhost:8080');
        console.log('📡 SSE endpoint: http://localhost:8080/message');
        // Keep alive
        setInterval(() => {
            // Heartbeat to prevent exit
        }, 30000);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        // Fallback to stdio
        const stdioTransport = new StdioServerTransport();
        await server.connect(stdioTransport);
    }
}
startServer();

#!/usr/bin/env node
import { MCPServer } from "mcp-framework";
import express from 'express';
const app = express();
const PORT = 8080;
// Enable CORS and JSON parsing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json());
// SSE endpoint
app.get('/message', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    // Keep connection alive
    const heartbeat = setInterval(() => {
        res.write('data: {"type": "ping"}\n\n');
    }, 30000);
    req.on('close', () => {
        clearInterval(heartbeat);
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        server: '5paisa_MCP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Start servers
async function startServer() {
    try {
        // Check if we're running in stdio mode (connected to parent process)
        const isStdioMode = !process.stdout.isTTY;
        if (false) {
            // Running as MCP server via stdio
            const server = new MCPServer();
            await server.start();
        }
        else {
            // Running standalone - start HTTP server
            console.log('🔧 Starting in standalone HTTP mode...');
            // Start HTTP server
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 5paisa MCP Server running on http://localhost:${PORT}`);
                console.log(`📡 SSE endpoint: http://localhost:${PORT}/message`);
                console.log(`❤️  Health check: http://localhost:${PORT}/health`);
                console.log(`⚡ MCP tools available via HTTP API`);
            });
            // Also start MCP server for dual mode
            const server = new MCPServer();
            // Don't await - let it run in background
            server.start().catch(console.error);
        }
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
startServer();

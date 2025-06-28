#!/usr/bin/env node
import { MCPServer } from "mcp-framework";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  credentials: false
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// SSE endpoint for MCP communication
app.get('/sse', (req, res) => {
  console.log('SSE connection established');
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection event
  res.write('data: {"type":"connection","status":"established"}\n\n');

  // Keep connection alive with periodic heartbeat
  const heartbeat = setInterval(() => {
    try {
      res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
    } catch (error) {
      console.error('Error sending heartbeat:', error);
      clearInterval(heartbeat);
    }
  }, 30000); // Send heartbeat every 30 seconds

  // Handle client disconnect
  req.on('close', () => {
    console.log('SSE connection closed');
    clearInterval(heartbeat);
  });

  req.on('error', (error) => {
    console.error('SSE connection error:', error);
    clearInterval(heartbeat);
  });
});

// Handle MCP JSON-RPC requests
app.post('/mcp', async (req, res) => {
  try {
    console.log('Received MCP request:', req.body);
    
    // Process MCP request through your server
    const response = await server.handleRequest(req.body);
    
    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    });
  }
});

// Create MCP server instance
const server = new MCPServer();

async function startServer() {
  try {
    // Initialize MCP server
    await server.start();
    console.log('MCP Server initialized');

    // Start Express server
    const httpServer = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
      console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      
      httpServer.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await server.stop();
          console.log('MCP server stopped');
        } catch (error) {
          console.error('Error stopping MCP server:', error);
        }
        
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
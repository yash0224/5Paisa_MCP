import { MCPServer } from "mcp-framework";

const port =   8080;
const server = new MCPServer();
server.start({ port });
console.log(`Server is running on port ${port}`);
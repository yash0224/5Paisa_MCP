import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HoldingsTool extends MCPTool<{}> {
  name = "Fetch_Holdings";
  description = "Fetch holdings from portfolio";
  schema = {}; 

  async execute() {
    try {
      const pythoncmd = python_cmd;
      const scriptPath = path.resolve(__dirname, exec_filepaths.fetch_holdings);
      const output = execSync(`${pythoncmd} ${scriptPath}`);
      const data = output.toString();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        
        const errWithCode = error as Error & { code?: string };
    
        if (errWithCode.code === 'NETWORK_ERROR') {
          throw new Error('Unable to reach external service');
        }
    
        throw new Error(`Operation failed: ${errWithCode.message}`);
      } else {
        throw new Error('An unknown error occurred');
    }
  }
}
}

export default HoldingsTool;

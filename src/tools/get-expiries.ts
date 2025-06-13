import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Expiriesinput {
    Exchange: string;
    Asset: string;
  }

class ExpiriesTool extends MCPTool<Expiriesinput> {
  name = "Get_Expiries";
  description = "Returns list of all active expiries";
  schema = {
    Exchange: {
        type: z.enum(['N', 'B']),
        description: "N for NSE and B for BSE",
    },
    Asset: {
      type: z.string(),
      description: "Name of the Index/Asset for which the option expiries are being fetched",
    },
  };    

  async execute({ Exchange, Asset }: Expiriesinput) {
    try {
      const pythonCmd = python_cmd;
      const scriptPath = path.resolve(__dirname, exec_filepaths.get_expires);
      const command = `${pythonCmd} ${scriptPath} ${Exchange} ${Asset}`  
      const output = execSync(command);
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

export default ExpiriesTool;

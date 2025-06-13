import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ScripCodeinput {
    Keyword: string;
    ExchangeType: string;
    Exchange: string;
  }

class ScripCodeTool extends MCPTool<ScripCodeinput> {
  name = "Scrip_code";
  description = "Fetch scrip codes based on keywords";
  schema = {
    Keyword: {
        type: z.string(),
        description: "Keyword by which scripmaster is searched",
    },
    ExchangeType: {
        type: z.enum(['C', 'D', 'U']),
        description: "C for Equity, D for Derivatives and U for Currency",
    },
    Exchange: {
        type: z.enum(['N', 'B', 'M']),
        description: "N for NSE and B for BSE, Stocks listed in SME are available in the M",
    }
  };    

  async execute({ Keyword, ExchangeType, Exchange }: ScripCodeinput) {
    try {
      const pythoncmd = python_cmd;
      const scriptPath = path.resolve(__dirname, exec_filepaths.get_scripcodes);
      const command = `${pythoncmd} ${scriptPath} ${Keyword} ${ExchangeType} ${Exchange}`  
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

export default ScripCodeTool;

import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MarketSnapshotinput {
    ScripCode: number;
    Exchange: string;
    ExchangeType: string;
  }

class MarketSnapshotTool extends MCPTool<MarketSnapshotinput> {
  name = "Fetch_MarketSnapshot";
  description = "Fetching the last traded price of an asset";
  schema = {
    ScripCode: {
        type: z.number(),
        description: "Code for asset",
    },
    Exchange: {
      type: z.enum(['N', 'B']),
      description: "N for NSE and B for BSE",
    },
    ExchangeType: {
        type: z.enum(['C', 'D', 'U']),
        description: "C for Equity, D for Derivatives and U for Currency",
    },
  };    

  async execute({ ScripCode, Exchange, ExchangeType }: MarketSnapshotinput) {
    try {
      const pythoncmd = python_cmd;
      const scriptPath = path.resolve(__dirname, exec_filepaths.fetch_marketsnapshot);
      const command = `${pythoncmd} ${scriptPath} ${ScripCode} ${Exchange} ${ExchangeType}`  
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

export default MarketSnapshotTool;

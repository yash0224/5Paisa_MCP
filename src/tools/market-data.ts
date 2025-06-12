import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Placinginput {
    Exchange: string;
    ExchangeType: string;
    ScripCode: number;
    TimeFrame: string;
    FromDate: string;
    ToDate: string;
  }
function getPythonCommand(): string {
  const commands = ["python3", "python"];
  for (const cmd of commands) {
    try {
      const version = execSync(`${cmd} --version`).toString();
      if (version.toLowerCase().includes("python")) {
        return cmd;
      }
    } catch {
      // Try the next one
    }
  }
  throw new Error("No suitable Python interpreter found. Please install Python.");
}  

class PlacingTool extends MCPTool<Placinginput> {
  name = "Market_Data";
  description = "Fetch historical data of market";
  schema = {
    Exchange: {
        type: z.enum(['N', 'B']),
        description: "N for NSE and B for BSE",
    },
    ExchangeType: {
        type: z.enum(['C', 'D', 'U']),
        description: "C for Equity, D for Derivatives and U for Currency",
    },
    ScripCode: {
        type: z.number(),
        description: "Code for asset",
    },
    TimeFrame: {
        type: z.enum(['1m','5m','10m','15m','30m','60m','1d']),
        description: "Time frame or candle length 1m fro 1 min, 5m for 5 min, 10m for 10 min, 15m for 15min, 30m for 30 min, 60m for 60 min, 1d for 1 day candles",
    },
    FromDate: {
        type: z.string(),
        description: "Date from which data needs to be fetched, format: YYYY-MM-DD",
    },
    ToDate: {
      type: z.string(),
      description: "Date untill which data needs to be fetched, format: YYYY-MM-DD",
    },
  };    

  async execute({ Exchange, ExchangeType, ScripCode, TimeFrame, FromDate, ToDate }: Placinginput) {
    try {
      const pythoncmd = getPythonCommand();
      const scriptPath = path.resolve(__dirname, exec_filepaths.market_data);
      const command = `${pythoncmd} ${scriptPath} ${Exchange} ${ExchangeType} ${ScripCode} ${TimeFrame} ${FromDate} ${ToDate}`  
      const output = execSync(command);
      const data = output.toString();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Optional: if using a library that throws custom error objects with "code"
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

export default PlacingTool;

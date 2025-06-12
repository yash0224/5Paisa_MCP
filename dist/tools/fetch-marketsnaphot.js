import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getPythonCommand() {
    const commands = ["python3", "python"];
    for (const cmd of commands) {
        try {
            const version = execSync(`${cmd} --version`).toString();
            if (version.toLowerCase().includes("python")) {
                return cmd;
            }
        }
        catch {
            // Try the next one
        }
    }
    throw new Error("No suitable Python interpreter found. Please install Python.");
}
class PlacingTool extends MCPTool {
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
    async execute({ ScripCode, Exchange, ExchangeType }) {
        try {
            const pythoncmd = getPythonCommand();
            const scriptPath = path.resolve(__dirname, exec_filepaths.fetch_marketsnapshot);
            const command = `${pythoncmd} ${scriptPath} ${ScripCode} ${Exchange} ${ExchangeType}`;
            const output = execSync(command);
            const data = output.toString();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                // Optional: if using a library that throws custom error objects with "code"
                const errWithCode = error;
                if (errWithCode.code === 'NETWORK_ERROR') {
                    throw new Error('Unable to reach external service');
                }
                throw new Error(`Operation failed: ${errWithCode.message}`);
            }
            else {
                throw new Error('An unknown error occurred');
            }
        }
    }
}
export default PlacingTool;

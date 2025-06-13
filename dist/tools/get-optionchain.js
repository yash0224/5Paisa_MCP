import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class OptionChainTool extends MCPTool {
    name = "Option_Chain";
    description = "Fetch option chain with expiry";
    schema = {
        Exchange: {
            type: z.enum(['N', 'B']),
            description: "N for NSE and B for BSE",
        },
        Asset: {
            type: z.string(),
            description: "Name of the index/asset for which option chain needs to be fetched",
        },
        TimetoExpiry: {
            type: z.number(),
            description: "Time to expiry of option chain which can be found from get_expiry tool. Example 1746694800000",
        },
    };
    async execute({ Exchange, Asset, TimetoExpiry }) {
        try {
            const pythoncmd = python_cmd;
            const scriptPath = path.resolve(__dirname, exec_filepaths.get_optionchain);
            const command = `${pythoncmd} ${scriptPath} ${Exchange} ${Asset} ${TimetoExpiry}`;
            const output = execSync(command);
            const data = output.toString();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
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
export default OptionChainTool;

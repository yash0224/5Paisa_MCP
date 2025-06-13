import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class ModifyOrderTool extends MCPTool {
    name = "Modify_Order";
    description = "Modify the order using exchange order id, which can be found in order book. Stop execution if failed";
    schema = {
        ExchangeID: {
            type: z.string(),
            description: "Exchange order id, which can be found in order book",
        },
        Qty: {
            type: z.number(),
            description: "Modifying quantity, -1 if not specified",
        },
        Price: {
            type: z.number(),
            description: "Modifying price, -1 if not specified",
        },
        StopLossPrice: {
            type: z.number(),
            description: "Modifying stop loss price, -1 if not specified",
        },
    };
    async execute({ ExchangeID, Qty, Price, StopLossPrice }) {
        try {
            const pythoncmd = python_cmd;
            const scriptPath = path.resolve(__dirname, exec_filepaths.modify_order);
            const command = `${pythoncmd} ${scriptPath} ${ExchangeID} ${Qty} ${Price} ${StopLossPrice}`;
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
export default ModifyOrderTool;

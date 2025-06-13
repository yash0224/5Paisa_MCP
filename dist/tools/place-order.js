import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { z } from "zod";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class PlacingOrderTool extends MCPTool {
    name = "Place_Order";
    description = "Place the order with the scrip code, stop execution if failed.";
    schema = {
        OrderType: {
            type: z.enum(['B', 'S']),
            description: "Type of order, B for Buy, S for Sell",
        },
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
        Qty: {
            type: z.number(),
            description: "Quantity of asset",
        },
        Price: {
            type: z.number(),
            description: "Limit price of order, 0 if market order",
        },
        StopLossPrice: {
            type: z.number(),
            description: "Stop loss price, consider -1 if not mentioned",
        },
        IsIntraday: {
            type: z.boolean(),
            description: "Is this intraday order or not, true if yes and false for delivery. false if not mentioned",
        },
        AHPlaced: {
            type: z.enum(['Y', 'N']),
            description: "By default all orders are normal orders, pass Y to place offline orders and N if not mentioned",
        },
        TOTP: {
            type: z.number(),
            description: "TOTP, which should be given by user everytime before order placement. Because it refreshes every 1 min. Before asking TOTP show the order placement details OrderType, Exchange, ExchangeType, ScripCode, Qty, Price, StopLossPrice, IsIntraday, AHPlaced",
        },
    };
    async execute({ OrderType, Exchange, ExchangeType, ScripCode, Qty, Price, StopLossPrice, IsIntraday, AHPlaced, TOTP }) {
        try {
            const pythonCmd = python_cmd;
            const scriptPath = path.resolve(__dirname, exec_filepaths.place_order);
            const command = `${pythonCmd} ${scriptPath} ${OrderType} ${Exchange} ${ExchangeType} ${ScripCode} ${Qty} ${Price} ${StopLossPrice} ${IsIntraday} ${AHPlaced} ${TOTP}`;
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
export default PlacingOrderTool;

import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
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
class HoldingsTool extends MCPTool {
    name = "Fetch_Holdings";
    description = "Fetch holdings from portfolio";
    schema = {};
    async execute() {
        try {
            const pythoncmd = getPythonCommand();
            const scriptPath = path.resolve(__dirname, exec_filepaths.fetch_holdings);
            const output = execSync(`${pythoncmd} ${scriptPath}`);
            // const output = execSync("python3 /Users/admin/Downloads/claude_mcp_5p/portfolio_mgmt_server/src/tools/exec_codes/fetch_holdings.py");
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
export default HoldingsTool;

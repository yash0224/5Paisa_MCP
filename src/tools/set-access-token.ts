import { MCPTool } from "mcp-framework";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };
import { python_cmd } from "./pythonCommand.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SetAccessTokenTool extends MCPTool<{}> {
  name = "Login";
  description = "Set and save 5paisa access token";
  schema = {};

  async execute() {
    try {
      const pythonCmd = python_cmd;
      const scriptPath = path.resolve(__dirname, exec_filepaths.set_access_token);
      const output = execSync(`${pythonCmd} ${scriptPath}`).toString();

      return {
        message: "Access token set successfully",
        log: output,
      };
    } catch (error: any) {
      return {
        error: "Failed to set access token",
        detail: error.message,
      };
    }
  }
}

export default SetAccessTokenTool;

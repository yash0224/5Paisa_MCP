import { MCPTool } from "mcp-framework";
// import { z } from "zod";
import { execSync } from "child_process";
// import { MCPServer } from "mcp-framework";
import { fileURLToPath } from "url";
import path from "path";
import exec_filepaths from './exec_paths.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

class SetAccessTokenTool extends MCPTool<{}> {
  name = "Login";
  description = "Set and save 5paisa access token";
  schema = {};

  async execute() {
    try {
      const pythonCmd = getPythonCommand();
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

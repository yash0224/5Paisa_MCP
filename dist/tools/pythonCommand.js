// pythonCmd.ts
import { execSync } from "child_process";
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
            // Try next
        }
    }
    throw new Error("No suitable Python interpreter found. Please install Python.");
}
export const python_cmd = getPythonCommand();

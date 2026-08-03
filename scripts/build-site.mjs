import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = process.env.CF_PAGES === "1"
  ? fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url))
  : fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const result = spawnSync(process.execPath, [cli, "build"], { stdio: "inherit" });

if (result.error) throw result.error;
process.exit(result.status ?? 1);

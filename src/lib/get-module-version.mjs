import path from "path";
import { readFile } from "fs/promises";
import { log } from "./log.mjs";

export async function getModuleVersion({ dir, name }) {
  try {
    const packageJsonPath = path.join(
      dir,
      `node_modules`,
      name,
      `package.json`
    );
    const file = await readFile(packageJsonPath, `utf8`);
    const { version } = JSON.parse(file);
    return version;
  } catch (error) {
    log.error(
      `Failed to get module version from package.json for module "${name}", skipping`
    );
    return null;
  }
}

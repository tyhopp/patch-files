import path from "path";
import { readFile } from "fs/promises";
import { PatchFilesError } from "./error.mjs";

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
  } catch (cause) {
    throw new PatchFilesError(
      `Failed to get module version from package.json for module "${name}"`,
      { cause }
    );
  }
}

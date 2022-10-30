import path from "path";
import { existsSync } from "fs";
import { PatchFilesError } from "./lib/error.js";
import { getModulePathInfo } from "./lib/get-module-path-info.js";
import { getRemoteFile } from "./lib/get-remote-file.js";
import { getModuleVersion } from "./lib/get-module-version.js";
import { createPatch } from "./lib/create-patch.js";

export async function createPatches(filePaths) {
  for (const filePath of filePaths) {
    const absoluteFilePath = path.join(process.cwd(), filePath);

    if (!existsSync(absoluteFilePath)) {
      throw new PatchFilesError( // node-do-not-add-exception-line
        `Local file "${filePath}" not found, paths must be relative to the project root (e.g. \`node_modules/a/a.js\`)`
      );
    }

    const { dir, name } = getModulePathInfo(filePath);

    const version = await getModuleVersion({
      dir,
      name,
    });

    if (!version) {
      continue;
    }

    // TODO: Make more robust
    const nodeModuleRelativePath = filePath.replace(
      `node_modules${path.sep}${name}`,
      ``
    );

    const patchId = await getRemoteFile({
      name,
      version,
      filePath: nodeModuleRelativePath,
    });

    await createPatch({ filePath, patchId });
  }
}

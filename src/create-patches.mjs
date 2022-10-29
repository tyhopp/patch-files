import path from "path";
import { existsSync } from "fs";
import { PatchFilesError } from "./lib/error.mjs";
import { getModulePathInfo } from "./lib/get-module-path-info.mjs";
import { getRemoteFile } from "./lib/get-remote-file.mjs";
import { getModuleVersion } from "./lib/get-module-version.mjs";
import { createPatch } from "./lib/create-patch.mjs";

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

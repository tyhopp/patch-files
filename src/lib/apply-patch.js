import path from "path";
import { readFile, writeFile } from "fs/promises";
import { getRemoteFile } from "./get-remote-file.js";
import { log } from "./log.js";
import { PatchFilesError } from "./error.js";
import * as diff from "diff";

export async function applyPatch(patch) {
  const patchDir = path.join(process.cwd(), `patch-files`);

  try {
    const [, name, version, filePath] = patch.match(
      /(.*?)@([\d|\.]*?)--(.*?)\.patch/
    );

    await getRemoteFile({
      name,
      version,
      filePath: path.join(path.sep, filePath.replaceAll(`--`, path.sep)),
    });

    const normalizedFilePath = path.resolve(
      `node_modules`,
      name,
      filePath.replaceAll(`--`, path.sep)
    );
    const patchPath = path.resolve(patchDir, patch);

    const fileContent = await readFile(normalizedFilePath, {
      encoding: `utf8`,
    });
    const patchContent = await readFile(patchPath, { encoding: `utf8` });
    const patchedFileContent = diff.applyPatch(fileContent, patchContent);

    await writeFile(normalizedFilePath, patchedFileContent);

    log.success(`Applied patch ${patch}`);
  } catch (_) {
    throw new PatchFilesError(`Failed to apply patch ${patch}`); // node-do-not-add-exception-line
  }
}

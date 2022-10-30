import path from "path";
import { readFile, writeFile } from "fs/promises";
import { getRemoteFile } from "./lib/get-remote-file.mjs";
import { log } from "./log.mjs";
import { PatchFilesError } from "./error.mjs";
import diff from "diff";

export async function applyPatch(patch) {
  try {
    const [, name, version, filePath] = patch.match(
      /(.*?)@([\d|\.]*?)--(.*?)\.patch/
    );

    await getRemoteFile({
      name,
      version,
      filePath: path.join(path.sep, filePath),
    });

    const normalizedFilePath = path.resolve(
      `node_modules`,
      `name`,
      filePath.replaceAll(`--`, path.sep)
    );
    const patchPath = path.resolve(patchDir, patch);

    const patchContent = await readFile(patchPath);
    const patchedFileContent = diff.applyPatch(
      normalizedFilePath,
      patchContent
    );
    await writeFile(normalizedFilePath, patchedFileContent);

    log.success(`Applied patch ${patch}`);
  } catch (_) {
    throw new PatchFilesError(`Failed to apply patch ${patch}`); // node-do-not-add-exception-line
  }
}

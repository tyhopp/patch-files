import path from "path";
import { readFile, writeFile } from "fs/promises";
import { getRemoteFile } from "./get-remote-file.js";
import { log } from "./log.js";
import { PatchFilesError } from "./error.js";
import { applyPatch as vendoredApplyPatch } from "../vendor/diff.js";

export async function applyPatch(patch) {
  const patchDir = path.join(process.cwd(), `patch-files`);

  try {
    const [, scope = "", nameScope, version, filePath] = patch.match(
      /(^@)?(.*?)@(.*?)--(.*?)\.patch/
    );
    const name = `${scope}${nameScope}`.replaceAll(`--`, path.sep);
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
    const cachedFilePath = path.resolve(
      `patch-files-cache`,
      patch.replace(`.patch`, ``)
    );
    const patchPath = path.resolve(patchDir, patch);

    const fileContent = await readFile(normalizedFilePath, {
      encoding: `utf8`,
    });
    const cachedFileContent = await readFile(cachedFilePath, {
      encoding: `utf8`,
    });
    const patchContent = await readFile(patchPath, { encoding: `utf8` });

    const patchedCachedFileContent = vendoredApplyPatch(
      cachedFileContent,
      patchContent
    );

    if (fileContent === patchedCachedFileContent) {
      log.info(`Already applied patch ${patch}`);
      return;
    }

    const patchedFileContent = vendoredApplyPatch(fileContent, patchContent);

    await writeFile(normalizedFilePath, patchedFileContent);

    log.success(`Applied patch ${patch}`);
  } catch (_) {
    throw new PatchFilesError(`Failed to apply patch ${patch}`); // node-do-not-add-exception-line
  }
}

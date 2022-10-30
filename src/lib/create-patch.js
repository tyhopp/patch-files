import path from "path";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { log } from "./log.js";
import { PatchFilesError } from "./error.js";
import * as diff from "diff";

export async function createPatch({ filePath, patchId }) {
  const patchDir = path.join(process.cwd(), `patch-files`);

  if (!existsSync(patchDir)) {
    await mkdir(patchDir);
  }

  try {
    const cachedFilePath = path.resolve(`patch-files-cache`, patchId);
    const changedFilePath = path.resolve(filePath);

    const cachedFileContent = await readFile(cachedFilePath, {
      encoding: `utf8`,
    });
    const changedFileContent = await readFile(changedFilePath, {
      encoding: `utf8`,
    });

    const patchFilePath = path.resolve(`patch-files`, `${patchId}.patch`);
    const patchContent = diff.createPatch(
      filePath,
      cachedFileContent,
      changedFileContent
    );

    await writeFile(patchFilePath, patchContent);

    log.success(`Created patch ${patchId}`);
  } catch (_) {
    throw new PatchFilesError(`Failed to create patch ${patchId}`); // node-do-not-add-exception-line
  }
}

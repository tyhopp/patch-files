import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { execSync } from "child_process";
import { patchDir } from "./known-paths.mjs";
import { log } from "./log.mjs";
import { PatchFilesError } from "./error.mjs";

export async function createPatch({ filePath, patchId }) {
  const absoluteFilePath = path.resolve(filePath);
  const absoluteCachedFilePath = path.resolve(`patch-files-cache`, patchId);
  const absolutePatchFilePath = path.resolve(`patch-files`, `${patchId}.patch`);

  if (!existsSync(patchDir)) {
    await mkdir(patchDir);
  }

  try {
    execSync(
      `git diff --no-index ${absoluteCachedFilePath} ${absoluteFilePath} > ${absolutePatchFilePath}`
    );
  } catch (error) {
    /**
     * Git diff return codes:
     * 0 - No difference found
     * 1 - Difference found
     * All other codes indicate an error occurred.
     * @see {@link https://github.com/git/git/blob/e188ec3a735ae52a0d0d3c22f9df6b29fa613b1e/diff-no-index.c#L305-L309}
     */
    switch (error.status) {
      case 0:
        log.info(`No changes to ${filePath}, skipping patch creation`);
        break;
      case 1:
        log.success(`Successfully created patch ${patchId}`);
        break;
      default:
        throw new PatchFilesError(`Failed to create patch ${patchId}`, {
          cause: error,
        });
    }
  }
}

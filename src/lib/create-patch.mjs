import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { spawnSync } from "child_process";
import { log } from "./log.mjs";
import { PatchFilesError } from "./error.mjs";

export async function createPatch({ filePath, patchId }) {
  const patchDir = path.join(process.cwd(), `patch-files`);

  // Git diff prefers relative paths
  const cachedFilePath = path.join(`patch-files-cache`, patchId);
  const patchFilePath = path.join(`patch-files`, `${patchId}.patch`);

  if (!existsSync(patchDir)) {
    await mkdir(patchDir);
  }

  const { stdout, status } = spawnSync(
    `git`,
    [`diff`, `--no-index`, cachedFilePath, filePath],
    {
      stdio: [`ignore`, `pipe`, `ignore`],
    }
  );

  /**
   * Git diff return codes:
   * 0: No changes found
   * 1: Changes found
   * All other codes indicate an error occurred.
   * @see {@link https://github.com/git/git/blob/e188ec3a735ae52a0d0d3c22f9df6b29fa613b1e/diff-no-index.c#L305-L309}
   */
  switch (status) {
    case 0:
      log.info(
        `No changes found for file "${filePath}", skipping patch creation`
      );
      break;
    case 1:
      const patch = stdout.toString();

      if (!patch.startsWith(`diff`)) {
        throw new PatchFilesError(`Failed to create patch ${patchId}`);
      }

      await writeFile(patchFilePath, patch);

      log.success(`Created patch "${patchId}"`);
      break;
    default:
      throw new PatchFilesError(`Failed to create patch ${patchId}`);
  }

  process.exit(0);
}

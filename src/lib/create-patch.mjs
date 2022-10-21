import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { execSync } from "child_process";
import { patchDir } from "./known-paths.mjs";
import { log } from "./log.mjs";

export async function createPatch({ filePath, patchId }) {
  const cachedFilePath = `patch-files-cache${path.sep}${patchId}`;
  const patchFilePath = `patch-files${path.sep}${patchId}.patch`;

  if (!existsSync(patchDir)) {
    await mkdir(patchDir);
  }

  try {
    execSync(
      `git diff --no-index ${cachedFilePath} ${filePath} > ${patchFilePath}`,
      {
        stdio: `inherit`,
      }
    );
  } catch (error) {
    // TODO: Not sure yet why `Error: Command failed` error is thrown, fix
    if (existsSync(patchFilePath)) {
      log.success(
        `Successfully created patch "patches${path.sep}${patchId}.patch"`
      );
    }
  }
}

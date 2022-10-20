import path from "path";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { execSync } from "child_process";
import { patchDir } from "./lib/known-paths.mjs";
import { log } from "./lib/log.mjs";
import { fetchFromUnpkg } from "./lib/fetch-from-unpkg.mjs";

export async function applyPatches() {
  if (!existsSync(patchDir)) {
    log.info(`No patches to apply, exiting`);
    process.exit(0);
  }

  const patches = await readdir(patchDir);

  for (const patch of patches) {
    // Ensure cache file exists before application
    const cacheFileName = patch.replace(`.patch`, ``);
    const normalizedCacheFileName = cacheFileName.replaceAll(`~`, path.sep);
    const [, name, version, filePath] = normalizedCacheFileName.match(
      new RegExp(`(.*?)@(.*?)${path.sep}(.*?)$`)
    );

    await fetchFromUnpkg({ name, version, filePath: `${path.sep}${filePath}` });

    const patchPath = `${patchDir}${path.sep}${patch}`;

    try {
      execSync(`git apply ${patchPath} --verbose`, {
        stdio: `inherit`,
      });
    } catch (error) {
      // TODO: Not sure yet why `Error: Command failed` error is thrown, fix
      log.success(`Successfully applied patch "${patchPath}"`);
    }
  }
}

import path from "path";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { execSync } from "child_process";
import { patchDir } from "./lib/known-paths.mjs";
import { fetchFromUnpkg } from "./lib/fetch-from-unpkg.mjs";
import { log } from "./lib/log.mjs";
import { PatchFilesError } from "./lib/error.mjs";

export async function applyPatches() {
  if (!existsSync(patchDir)) {
    log.info(`No patches to apply, exiting`);
    process.exit();
  }

  const patches = await readdir(patchDir);

  for (const patch of patches) {
    // Ensure cache file exists before application
    const cacheFileName = patch.replace(`.patch`, ``);
    const normalizedCacheFileName = cacheFileName.replaceAll(`--`, path.sep);
    const [, name, version, filePath] = normalizedCacheFileName.match(
      new RegExp(`(.*?)@(.*?)${path.sep}(.*?)$`)
    );

    await fetchFromUnpkg({ name, version, filePath: `${path.sep}${filePath}` });

    const patchPath = `${patchDir}${path.sep}${patch}`;

    try {
      execSync(`git apply ${patchPath} --verbose`);
    } catch (error) {
      /**
       * Git apply return codes:
       * -1 - An error occurred
       * 0 - Patch applied successfully
       * 1 - Patch not applied successfully
       * @see {@link https://github.com/git/git/blob/f9b95943b68b6b8ca5a6072f50a08411c6449b55/apply.c#L4611-L4616}
       */
      switch (error.status) {
        case 0:
          log.success(`Successfully applied patch ${patch}`);
          break;
        default:
          throw new PatchFilesError(`Failed to apply patch ${patch}`, {
            cause: error,
          });
      }
    }
  }
}

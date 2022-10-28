import path from "path";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { spawnSync } from "child_process";
import { getRemoteFile } from "./lib/get-remote-file.mjs";
import { log } from "./lib/log.mjs";
import { PatchFilesError } from "./lib/error.mjs";

export async function applyPatches() {
  const patchDir = path.join(process.cwd(), `patch-files`);

  if (!existsSync(patchDir)) {
    log.info(`No patches to apply, exiting`);
    process.exit(0);
  }

  const patches = await readdir(patchDir);

  if (!patches.length) {
    log.info(`No patches to apply, exiting`);
    process.exit(0);
  }

  for (const patch of patches) {
    const [, name, version, filePath] = patch.match(
      /(.*?)@([\d|\.]*?)--(.*?)\.patch/
    );

    await getRemoteFile({ name, version, filePath: `${path.sep}${filePath}` });

    const patchPath = path.join(patchDir, patch);

    const { status } = spawnSync(`git`, [`apply`, patchPath], {
      stdio: [`ignore`],
    });

    /**
     * Git apply return codes:
     * -1: An error occurred
     *  0: Patch applied cleanly
     *  1: Patch not applied cleanly
     * @see {@link https://github.com/git/git/blob/f9b95943b68b6b8ca5a6072f50a08411c6449b55/apply.c#L4611-L4616}
     */
    switch (status) {
      case 0:
        log.success(`Applied patch ${patch}`);
        break;
      default:
        throw new PatchFilesError(`Failed to apply patch ${patch}`);
    }
  }
}

import path from "path";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { log } from "./lib/log.js";
import { applyPatch } from "./lib/apply-patch.js";

export async function applyPatches() {
  const patchDir = path.join(process.cwd(), `patch-files`);

  if (!existsSync(patchDir)) {
    log.info(`No patches to apply`);
    return;
  }

  const patches = await readdir(patchDir);

  if (!patches.length) {
    log.info(`No patches to apply`);
    return;
  }

  for (const patch of patches) {
    await applyPatch(patch);
  }
}

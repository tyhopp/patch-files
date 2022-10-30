import { applyPatches } from "./apply-patches.js";
import { createPatches } from "./create-patches.js";

export async function patchFiles(filePaths = []) {
  if (filePaths.length) {
    await createPatches(filePaths);
  } else {
    await applyPatches();
  }
}

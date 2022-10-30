import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { PatchFilesError } from "./error.js";

const jsdelivr = `https://cdn.jsdelivr.net/npm/`;
const unpkg = `https://unpkg.com/`;

export const patchFileCacheDir = path.join(process.cwd(), `patch-files-cache`);

export async function getRemoteFile({ name, version, filePath }) {
  const patchId = `${name}@${version}${filePath}`;
  const normalizedPatchId = patchId.replaceAll(path.sep, `--`);
  const cachedFilePath = path.join(patchFileCacheDir, normalizedPatchId);

  if (existsSync(cachedFilePath)) {
    return normalizedPatchId;
  }

  if (!existsSync(patchFileCacheDir)) {
    await mkdir(patchFileCacheDir);
  }

  const CDNs = [jsdelivr, unpkg];

  let complete = false;

  do {
    const CDN = CDNs.shift();
    const url = `${CDN}${patchId}`.replaceAll(path.sep, path.posix.sep);
    const response = await fetch(url);

    if (response.status === 200) {
      const fileContent = await response.text();
      await writeFile(cachedFilePath, fileContent);
      complete = true;
      break;
    }

    if (response.status >= 500) {
      continue;
    }
  } while (!complete && CDNs.length);

  if (!complete) {
    throw new PatchFilesError( // node-do-not-add-exception-line
      `Failed to request remote file "${filePath}" for comparison`
    );
  }

  return normalizedPatchId;
}

import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { fetch } from "undici";
import { unpkg, patchFileCacheDir } from "./known-paths.mjs";
import { PatchFilesError } from "./error.mjs";

export async function fetchFromUnpkg({ name, version, filePath }) {
  const unpkgPath = `${name}@${version}${filePath}`;
  const unpkgUrl = `${unpkg}${unpkgPath}`;

  const patchId = unpkgPath.replaceAll(path.sep, `--`);
  const cachedFilePath = path.join(patchFileCacheDir, patchId);

  try {
    if (existsSync(cachedFilePath)) {
      return patchId;
    }

    const unpkgFile = await fetch(unpkgUrl).then((response) => response.text());

    if (!existsSync(patchFileCacheDir)) {
      await mkdir(patchFileCacheDir);
    }

    await writeFile(cachedFilePath, unpkgFile);

    return patchId;
  } catch (cause) {
    throw new PatchFilesError(`Failed to fetch file "${unpkgUrl}" from unpkg`, {
      cause,
    });
  }
}

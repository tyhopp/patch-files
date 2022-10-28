import path from "path";
import { PatchFilesError } from "./error.mjs";

export function getModulePathInfo(filePath) {
  try {
    const absoluteFilePath = path.join(process.cwd(), filePath);
    const deepestNodeModuleMatch = [...filePath.matchAll(`node_modules`)].pop();
    const { index, input } = deepestNodeModuleMatch;
    const deepestNodeModulePath = input.slice(index);
    const [, name] = deepestNodeModulePath.split(path.sep);
    const dir = absoluteFilePath.replace(deepestNodeModulePath, ``);

    return {
      dir,
      name,
    };
  } catch (_) {
    throw new PatchFilesError(
      `Failed to get module path info from ${filePath}`
    );
  }
}

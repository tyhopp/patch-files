import path from "path";
import { cwd } from "./known-paths.mjs";

export function getModulePathInfo(filePath) {
  const absoluteFilePath = path.join(cwd, filePath);
  const deepestNodeModuleMatch = [...filePath.matchAll(`node_modules`)].pop();
  const { index, input } = deepestNodeModuleMatch;
  const deepestNodeModulePath = input.slice(index);
  const [, name] = deepestNodeModulePath.split(path.sep);
  const dir = absoluteFilePath.replace(deepestNodeModulePath, ``);

  return {
    dir,
    name,
  };
}

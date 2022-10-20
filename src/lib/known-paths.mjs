import path from "path";

export const cwd = process.cwd();
export const patchDir = path.join(cwd, `patches`);
export const patchFileCacheDir = path.join(cwd, `.patch-files-cache`);

export const unpkg = `https://unpkg.com/`;

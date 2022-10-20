#!/usr/bin/env node

import { applyPatches } from "./src/apply-patches.mjs";
import { createPatches } from "./src/create-patches.mjs";

const [filePathsString = ``] = process.argv.slice(2) || [];
const filePaths = filePathsString ? filePathsString.split(`,`) : [];

if (!filePaths.length) {
  await applyPatches();
  process.exit(0);
}

await createPatches(filePaths);

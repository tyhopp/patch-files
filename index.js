#!/usr/bin/env node

import { applyPatches } from "./src/apply-patches.js";
import { createPatches } from "./src/create-patches.js";

const [filePathsString = ``] = process.argv.slice(2) || [];
const filePaths = filePathsString ? filePathsString.split(`,`) : [];

if (filePaths.length) {
  await createPatches(filePaths);
} else {
  await applyPatches();
}

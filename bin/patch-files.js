#!/usr/bin/env node

import { patchFiles } from "../src/patch-files.js";

const [filePathsString = ``] = process.argv.slice(2) || [];
const filePaths = filePathsString ? filePathsString.split(`,`) : [];

patchFiles(filePaths);

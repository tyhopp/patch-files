import path from "path";
import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { applyPatches } from "../src/apply-patches.mjs";

const aFilePath = path.join(`node_modules`, `uvu`, `run`, `index.js`);
const bFilePath = path.join(`node_modules`, `uvu`, `run`, `index.mjs`);

const fixtures = {
  a: {
    filePath: aFilePath,
    fileContent: fs.readFileSync(aFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.js`,
    patch: `uvu@0.5.6--run--index.js.patch`,
    patchContent: fs.readFileSync(
      path.join(`fixtures`, `uvu@0.5.6--run--index.js.patch`)
    ),
  },
  b: {
    filePath: bFilePath,
    fileContent: fs.readFileSync(bFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.mjs`,
    patch: `uvu@0.5.6--run--index.mjs.patch`,
    patchContent: fs.readFileSync(
      path.join(`fixtures`, `uvu@0.5.6--run--index.mjs.patch`)
    ),
  },
};

const change = {
  a: `\n\nconst a = 1;`,
  b: `\n\nconst b = 2;`,
};

const absolutePatchFilesDir = path.resolve(`patch-files`);
const absolutePatchFilesCacheDir = path.resolve(`patch-files-cache`);

test.before.each(() => {
  if (!fs.existsSync(absolutePatchFilesDir)) {
    fs.mkdirSync(absolutePatchFilesDir);
  }

  for (const fixture in fixtures) {
    const { patch, patchContent } = fixtures[fixture];
    fs.writeFileSync(path.join(absolutePatchFilesDir, patch), patchContent);
  }
});

test.after.each(() => {
  for (const fixture in fixtures) {
    const { filePath, fileContent } = fixtures[fixture];
    fs.writeFileSync(filePath, fileContent);
  }

  for (const patchDir of [absolutePatchFilesDir, absolutePatchFilesCacheDir]) {
    fs.rmSync(patchDir, { recursive: true });
  }
});

test(`applies patches`, async () => {
  await applyPatches();

  const [cacheFileName] = fs.readdirSync(absolutePatchFilesCacheDir);

  const aChangedFileContent = fs.readFileSync(fixtures.a.filePath, `utf8`);
  const bChangedFileContent = fs.readFileSync(fixtures.b.filePath, `utf8`);

  assert.is(cacheFileName, fixtures.a.cache);
  assert.ok(aChangedFileContent.includes(change.a.trim()));
  assert.ok(bChangedFileContent.includes(change.b.trim()));
});

test.run();

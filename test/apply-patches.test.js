import path from "path";
import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { applyPatches } from "../src/apply-patches.js";

const aFilePath = path.join(
  `node_modules`,
  `@types`,
  `http-errors`,
  `index.d.ts`
);
const bFilePath = path.join(`node_modules`, `uvu`, `run`, `index.js`);
const cFilePath = path.join(`node_modules`, `uvu`, `run`, `index.mjs`);

const fixtures = {
  a: {
    filePath: aFilePath,
    fileContent: fs.readFileSync(aFilePath, `utf8`),
    cache: `@types--http-errors@2.0.4--index.d.ts`,
    patch: `@types--http-errors@2.0.4--index.d.ts.patch`,
    patchContent: fs.readFileSync(
      path.join(`fixtures`, `@types--http-errors@2.0.4--index.d.ts.patch`)
    ),
  },
  b: {
    filePath: bFilePath,
    fileContent: fs.readFileSync(bFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.js`,
    patch: `uvu@0.5.6--run--index.js.patch`,
    patchContent: fs.readFileSync(
      path.join(`fixtures`, `uvu@0.5.6--run--index.js.patch`)
    ),
  },
  c: {
    filePath: cFilePath,
    fileContent: fs.readFileSync(cFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.mjs`,
    patch: `uvu@0.5.6--run--index.mjs.patch`,
    patchContent: fs.readFileSync(
      path.join(`fixtures`, `uvu@0.5.6--run--index.mjs.patch`)
    ),
  },
};

const change = {
  a: `type a = string;`,
  b: `const b = 2;`,
  c: `const c = 3;`,
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

  const [aCacheFileName, bCacheFileName, cCacheFileName] = fs.readdirSync(
    absolutePatchFilesCacheDir
  );

  const aChangedFileContent = fs.readFileSync(fixtures.a.filePath, `utf8`);
  const bChangedFileContent = fs.readFileSync(fixtures.b.filePath, `utf8`);
  const cChangedFileContent = fs.readFileSync(fixtures.c.filePath, `utf8`);

  assert.is(aCacheFileName, fixtures.a.cache);
  assert.is(bCacheFileName, fixtures.b.cache);
  assert.is(cCacheFileName, fixtures.c.cache);
  assert.is(aChangedFileContent, fixtures.a.fileContent + change.a);
  assert.is(bChangedFileContent, fixtures.b.fileContent + change.b);
  assert.is(cChangedFileContent, fixtures.c.fileContent + change.c);
});

test(`does not error if patch has already been applied`, async () => {
  await applyPatches();
  await applyPatches();

  const [aCacheFileName, bCacheFileName, cCacheFileName] = fs.readdirSync(
    absolutePatchFilesCacheDir
  );

  const aChangedFileContent = fs.readFileSync(fixtures.a.filePath, `utf8`);
  const bChangedFileContent = fs.readFileSync(fixtures.b.filePath, `utf8`);
  const cChangedFileContent = fs.readFileSync(fixtures.c.filePath, `utf8`);

  assert.is(aCacheFileName, fixtures.a.cache);
  assert.is(bCacheFileName, fixtures.b.cache);
  assert.is(cCacheFileName, fixtures.c.cache);
  assert.is(aChangedFileContent, fixtures.a.fileContent + change.a);
  assert.is(bChangedFileContent, fixtures.b.fileContent + change.b);
  assert.is(cChangedFileContent, fixtures.c.fileContent + change.c);
});

test.run();

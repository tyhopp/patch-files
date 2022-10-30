import path from "path";
import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createPatches } from "../src/create-patches.js";

const aFilePath = path.join(`node_modules`, `uvu`, `run`, `index.js`);
const bFilePath = path.join(`node_modules`, `uvu`, `run`, `index.mjs`);

const fixtures = {
  a: {
    filePath: aFilePath,
    fileContent: fs.readFileSync(aFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.js`,
    patch: `uvu@0.5.6--run--index.js.patch`,
  },
  b: {
    filePath: bFilePath,
    fileContent: fs.readFileSync(bFilePath, `utf8`),
    cache: `uvu@0.5.6--run--index.mjs`,
    patch: `uvu@0.5.6--run--index.mjs.patch`,
  },
};

const change = {
  a: `\n\nconst a = 1;`,
  b: `\n\nconst b = 2;`,
};

const absolutePatchFilesDir = path.resolve(`patch-files`);
const absolutePatchFilesCacheDir = path.resolve(`patch-files-cache`);

test.after.each(() => {
  for (const fixture in fixtures) {
    const { filePath, fileContent } = fixtures[fixture];
    fs.writeFileSync(filePath, fileContent);
  }

  for (const patchDir of [absolutePatchFilesDir, absolutePatchFilesCacheDir]) {
    fs.rmSync(patchDir, { recursive: true });
  }
});

test(`creates a new patch`, async () => {
  fs.appendFileSync(fixtures.a.filePath, change.a);

  await createPatches([fixtures.a.filePath]);

  const [cacheFileName] = fs.readdirSync(absolutePatchFilesCacheDir);
  const [patchFileName] = fs.readdirSync(absolutePatchFilesDir);

  const patchContent = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileName),
    `utf8`
  );

  assert.is(cacheFileName, fixtures.a.cache);
  assert.is(patchFileName, fixtures.a.patch);
  assert.ok(patchContent.includes(change.a.trim()));
});

test(`creates multiple new patches`, async () => {
  fs.appendFileSync(fixtures.a.filePath, change.a);
  fs.appendFileSync(fixtures.b.filePath, change.b);

  await createPatches([fixtures.a.filePath, fixtures.b.filePath]);

  const [cacheFileNameA, cacheFileNameB] = fs.readdirSync(
    absolutePatchFilesCacheDir
  );
  const [patchFileNameA, patchFileNameB] = fs.readdirSync(
    absolutePatchFilesDir
  );
  const patchAContent = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameA),
    `utf8`
  );
  const patchBContent = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameB),
    `utf8`
  );

  assert.is(cacheFileNameA, fixtures.a.cache);
  assert.is(cacheFileNameB, fixtures.b.cache);
  assert.is(patchFileNameA, fixtures.a.patch);
  assert.is(patchFileNameB, fixtures.b.patch);
  assert.ok(patchAContent.includes(change.a.trim()));
  assert.ok(patchBContent.includes(change.b.trim()));
});

test(`creates subsequent patches the same`, async () => {
  fs.appendFileSync(fixtures.a.filePath, change.a);

  await createPatches([fixtures.a.filePath]);

  const [patchFileNameA] = fs.readdirSync(absolutePatchFilesDir);
  const patchContentOne = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameA),
    `utf8`
  );

  await createPatches([fixtures.a.filePath]);

  const [patchFileNameB] = fs.readdirSync(absolutePatchFilesDir);
  const patchContentTwo = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameB),
    `utf8`
  );

  assert.is(patchContentOne, patchContentTwo);
});

test.run();

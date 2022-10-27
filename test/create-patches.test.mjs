import path from "path";
import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createPatches } from "../src/create-patches.mjs";

const fixtures = {
  a: {
    path: `node_modules/uvu/run/index.js`,
    content: fs.readFileSync(`node_modules/uvu/run/index.js`, `utf8`),
    cache: `uvu@0.5.6--run--index.js`,
    patch: `uvu@0.5.6--run--index.js.patch`,
  },
  b: {
    path: `node_modules/uvu/run/index.mjs`,
    content: fs.readFileSync(`node_modules/uvu/run/index.mjs`, `utf8`),
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
    const { path, content } = fixtures[fixture];
    fs.writeFileSync(path, content);
  }

  for (const patchDir of [absolutePatchFilesDir, absolutePatchFilesCacheDir]) {
    fs.rmSync(patchDir, { recursive: true });
  }
});

test.only(`creates a new patch`, async () => {
  fs.appendFileSync(fixtures.a.path, change.a);

  await createPatches([fixtures.a.path]);

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
  fs.appendFileSync(fixtures.a.path, change.a);
  fs.appendFileSync(fixtures.b.path, change.b);

  await createPatches([fixtures.a.path, fixtures.b.path]);

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
  fs.appendFileSync(fixtures.a.path, change.a);

  await createPatches([fixtures.a.path]);

  const [patchFileNameA] = fs.readdirSync(absolutePatchFilesDir);
  const patchContentOne = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameA),
    `utf8`
  );

  await createPatches([fixtures.a.path]);

  const [patchFileNameB] = fs.readdirSync(absolutePatchFilesDir);
  const patchContentTwo = fs.readFileSync(
    path.join(absolutePatchFilesDir, patchFileNameB),
    `utf8`
  );

  assert.is(patchContentOne, patchContentTwo);
});

test.run();

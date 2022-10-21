import path from "path";
import fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createPatches } from "../src/create-patches.mjs";

const fixtures = {
  a: {
    path: `node_modules/uvu/run/index.js`,
    content: fs.readFileSync(`node_modules/uvu/run/index.js`, `utf8`),
    cache: `uvu@0.5.6~run~index.js`,
    patch: `uvu@0.5.6~run~index.js.patch`,
  },
  b: {
    path: `node_modules/uvu/run/index.mjs`,
    content: fs.readFileSync(`node_modules/uvu/run/index.mjs`, `utf8`),
    cache: `uvu@0.5.6~run~index.mjs`,
    patch: `uvu@0.5.6~run~index.mjs.patch`,
  },
};

const change = {
  a: `\n\nconst a = 1;`,
  b: `\n\nconst b = 2;`,
};

const patchFiles = path.resolve(`patch-files`);
const patchFilesCache = path.resolve(`patch-files-cache`);

test.after.each(() => {
  for (const fixture in fixtures) {
    const { path, content } = fixtures[fixture];
    fs.writeFileSync(path, content);
  }

  for (const patchDir of [patchFiles, patchFilesCache]) {
    fs.rmSync(patchDir, { recursive: true });
  }
});

test(`creates a new patch`, async () => {
  fs.appendFileSync(fixtures.a.path, change.a);

  await createPatches([fixtures.a.path]);

  const [cache] = fs.readdirSync(patchFilesCache);
  const [patch] = fs.readdirSync(patchFiles);
  const patchContent = fs.readFileSync(path.join(patchFiles, patch), `utf8`);

  assert.is(cache, fixtures.a.cache);
  assert.is(patch, fixtures.a.patch);
  assert.ok(patchContent.includes(change.a.trim()));
});

test(`creates multiple new patches`, async () => {
  fs.appendFileSync(fixtures.a.path, change.a);
  fs.appendFileSync(fixtures.b.path, change.b);

  await createPatches([fixtures.a.path, fixtures.b.path]);

  const [cacheA, cacheB] = fs.readdirSync(patchFilesCache);
  const [patchA, patchB] = fs.readdirSync(patchFiles);
  const patchAContent = fs.readFileSync(path.join(patchFiles, patchA), `utf8`);
  const patchBContent = fs.readFileSync(path.join(patchFiles, patchB), `utf8`);

  assert.is(cacheA, fixtures.a.cache);
  assert.is(cacheB, fixtures.b.cache);
  assert.is(patchA, fixtures.a.patch);
  assert.is(patchB, fixtures.b.patch);
  assert.ok(patchAContent.includes(change.a.trim()));
  assert.ok(patchBContent.includes(change.b.trim()));
});

test(`creates subsequent patches the same`, async () => {
  fs.appendFileSync(fixtures.a.path, change.a);

  await createPatches([fixtures.a.path]);

  const [patchOne] = fs.readdirSync(patchFiles);
  const patchContentOne = fs.readFileSync(
    path.join(patchFiles, patchOne),
    `utf8`
  );

  await createPatches([fixtures.a.path]);

  const [patchTwo] = fs.readdirSync(patchFiles);
  const patchContentTwo = fs.readFileSync(
    path.join(patchFiles, patchTwo),
    `utf8`
  );

  assert.is(patchContentOne, patchContentTwo);
});

test.run();

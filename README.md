# patch-files

> This module is a work in progress, probably best not to use it yet.

Create and apply patches for file changes in `node_modules`.

Useful if you want to create patches faster than with [`patch-package`](https://github.com/ds300/patch-package), which can be slow if you're patching a large module.

## Usage

To create a patch for a single file:

```bash
npx patch-files@latest node_modules/a/a.js
```

To create a patch for a multiple file:

```bash
npx patch-files@latest node_modules/a/a.js,node_modules/b/b.js
```

To apply patches:

```bash
npx patch-files@latest
```

If you use [VSCode](https://code.visualstudio.com), you can right click on a file and select "Copy Relative File" to get file path quickly.

You can apply patches in a `postinstall` script so patches are applied whenever you install your node modules:

```json
{
  "scripts": {
    "postinstall": "npx patch-files@latest`
  },
```

## Todo

- [ ] Tests
- [ ] CI
- [ ] Figure out why applying diffs deletes the file in `.patch-files-cache`

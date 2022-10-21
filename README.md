# patch-files

Create and apply patches for file changes in `node_modules`.

Useful if you want to create patches faster than with [`patch-package`](https://github.com/ds300/patch-package), which is slow if you patch a large module.

## Usage

> Commands should be run from the root of your project directory.

To create a patch for a single file:

```bash
npx patch-files@latest node_modules/a/a.js
```

To create a patch for multiple files:

```bash
npx patch-files@latest node_modules/a/a.js,node_modules/b/b.js
```

To apply patches:

```bash
npx patch-files@latest
```

Two directories are created:

- `patch-files` is where patch files are written
- `patch-files-cache` - is where the files fetched for comparison are written

You can apply patches in a `postinstall` script so patches are applied whenever you install your node modules:

```json
{
  "scripts": {
    "postinstall": "npx patch-files@latest"
  }
}
```

## Todo

- [ ] Tests
- [ ] CI
- [ ] Figure out why applying diffs deletes the file in `.patch-files-cache`

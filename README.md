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
- `patch-files-cache` is where the files fetched for comparison are written

You can apply patches in a `postinstall` script so patches are applied whenever you install your node modules:

```json
{
  "scripts": {
    "postinstall": "npx patch-files@latest"
  }
}
```

## How is `patch-files` different from `patch-package`?

The main difference is `patch-package` works by downloading an entire module from `npm` to compare your changes, while `patch-files` works by downloading just the individual file(s) from [unpkg](https://unpkg.com).

For small modules, this may not have a noticable performance impact.

For large modules, `patch-files` can be seconds or even minutes faster than `patch-package`.

The tradeoff is `patch-files` depends on [unpkg](https://unpkg.com) in addition to the `npm` registry to work.

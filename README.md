# patch-files

Create and apply patches for file changes in `node_modules`.

A small (4.1kb minified + gzipped), fast alternative to [`patch-package`](https://github.com/ds300/patch-package). See the [table of differences](#how-is-patch-files-different-from-patch-package) below.

## Usage

Keep in mind that `patch-files`:

- Requires Node 18 or greater
- Should be run from the root of your project

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

| `patch-files`                                                                               | `patch-package`                                                                                 |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 4.1kb minified + gzipped [as of v6.0.0](https://bundlephobia.com/package/patch-files@6.0.0) | 124.8kb minified + gzipped [as of v6.5.0](https://bundlephobia.com/package/patch-package@6.5.0) |
| 0 dependencies                                                                              | 14 dependencies                                                                                 |
| Downloads individual file(s)                                                                | Downloads entire npm modules                                                                    |
| Does not depend on Git                                                                      | Depends on Git                                                                                  |
| Relies on CDNs [jsdelivr](https://www.jsdelivr.com/) or [unpkg](https://unpkg.com)          | Relies on the npm registry                                                                      |
| Requires Node 18 or greater                                                                 | Requires Node 10 or greater                                                                     |

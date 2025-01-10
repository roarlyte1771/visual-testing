# Contributing Guide

## Prerequisites

This repository uses [pnpm].

The best way to get [pnpm] is by enabling [corepack]:

```sh
# install corepack for Node.js before 14.19.0 and 16.9.0 to use pnpm
npm install -g corepack

# enable pnpm with corepack
corepack enable
```

Or you can install [pnpm] directly:

```sh
npm install -g pnpm
```

## Useful Commands

```sh
# build all projects
pnpm build

# run biome check
pnpm check

# build and test all projects
pnpm verify # or pnpm v

# test vitest-plugin-vis in watch mode
pnpm vpv w

# test storybook-addon-vis in watch mode
pnpm sav w
```

[corepack]: https://nodejs.org/api/corepack.html
[pnpm]: https://pnpm.io/

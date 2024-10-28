# storybook-addon-vis

Storybook Vitest Image Snapshot add-on.

Captures and compare image snapshot automatically and manually.

This add-on is inspired by [jest-image-snapshot].

Starting from [storybook] 8.3,
you can run Storybook stories with [vitest] browser mode.

Since it is running in actual browser, [jest-image-snapshot] does not work.
This add-on provides similar functionality to [jest-image-snapshot].
In addition, you can capture image snapshot manually.

## Install

```sh
npm install --save-dev storybook-addon-vis

pnpm add --save-dev storybook-addon-vis

yarn add --save-dev storybook-addon-vis
```

## Config

This add-on provides features on both [storybook] and [vitest],
thus you need to add it to both [storybook] and [vitest].

On [vitest], you need to add `storybook-addon-vis/vitest-plugin` plugin in `vitest.config.ts`.

```ts
// vite.config.ts or vitest.config.ts
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'
import { defineConfig } from 'vitest/config'
import { storybookVis } from 'storybook-addon-vis/vitest-plugin'

export default defineConfig({
   plugins: [
    storybookTest(),
    storybookVis()],
   test: {
    browser: {
      // ...
    }
    setupFiles: ['./vitest.setup.ts'],
  }
})
```

Also note that you need to add `vitest.setup.ts` file to set up the test environment.
You need to do that anyway when you set up [storybook] with [vitest].

In `vitest.setup.ts`, you need to extend [vitest] `expect` and register lifecycle hooks so that [storybook-addon-vis] can access the test context info to capture image snapshot.

```ts
// vitest.setup.ts
import { type StoryContext, setProjectAnnotations } from '@storybook/react'
import { afterEach, beforeAll, beforeEach, expect } from 'vitest'
import {
  configureSnapshotBeforeAll,
  configureSnapshotBeforeEach,
  page,
  shouldTakeSnapshot,
  toMatchImageSnapshot,
} from 'storybook-addon-vis/vitest-setup.js'
import * as projectAnnotations from './preview'

const project = setProjectAnnotations([projectAnnotations])

expect.extend({ toMatchImageSnapshot })

beforeAll((suite) => {
  project.beforeAll()
  configureSnapshotBeforeAll(suite)
})

beforeEach(configureSnapshotBeforeEach)

afterEach<{ story?: StoryContext }>(async (ctx) => {
  if (!shouldTakeSnapshot(ctx)) return

  await expect(page.imageSnapshot()).toMatchImageSnapshot()
})
```

On [storybook], you need to extend the `expect` from `@storybook/test`

```ts
// .storybook/preview.tsx
import { expect } from '@storybook/test'
import { toMatchImageSnapshot } from '../src/index.js'

expect.extend({ toMatchImageSnapshot })

// ...
```

## Usage - automatic snapshot

The `afterEach` hook above is how to capture the image snapshot automatically,
when you add a `snapshot` tag to the story.

```ts
// story.tsx
export default {
  title: 'Button',
  // Take image snapshot automatically for all stories in this file
  tags: ['snapshot']
}

export const MyStory = {
  // Take image snapshot automatically for this story
  tags: ['snapshot'],
  // ...
}
```

You can disable snapshot capturing with the `!snapshot` tag,
much like `!test`.

```ts
export default {
  title: 'Button',
  tags: ['snapshot']
}

export const MyStory = {
  // Disable image snapshot for this story
  tags: ['!snapshot'],
  // ...
}
```

## Usage - manual snapshot

Besides automatic snapshot, you can capture image snapshot manually.

```ts
import { page } from 'storybook-addon-vis'
import { expect } from '@storybook/test'

export const PageSnapshot = {
  // ...
  async play() {
    expect(page.imageSnapshot()).toMatchImageSnapshot()
  }
}

export const ElementSnapshot = {
  // ...
  async play({ canvas }) {
    const element = await canvas.getByTestid('subject')
    await expect(page.imageSnapshot([ element ])).toMatchImageSnapshot()
  }
}
```

[jest-image-snapshot]: https://github.com/americanexpress/jest-image-snapshot
[storybook-addon-vis]: https://github.com/repobuddy/storybook-addon-vis
[storybook]: https://storybook.js.org
[vitest]: https://vitest.dev/
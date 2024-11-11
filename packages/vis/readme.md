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
import { storybookVis } from 'storybook-addon-vis/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	 plugins: [
		storybookTest(),
		storybookVis()
	],
	test: {
		browser: {
			// ...
		}
		setupFiles: ['./vitest.setup.ts'],
	}
})
```

In `vitest.setup.ts`, you can use one of the presets to do the setup for you.
You can also use the provided hooks to set up the test environment manually.

```ts
// vitest.setup.ts
import { setProjectAnnotations } from '@storybook/react'
import { createVisConfig } from 'storybook-addon-vis/vitest-setup'
import * as projectAnnotations from './preview'

const project = setProjectAnnotations([projectAnnotations])

// capture image snapshot for all stories with `snapshot` tag
createVisConfig(/* options */).presets.basic()

// capture image snapshot for all stories with `snapshot` tag,
// for both light and dark themes
createVisConfig(/* options */).presets.theme({
	light() { document.body.classList.remove('dark') },
	dark() { document.body.classList.add('dark') },
})
```

On [storybook], you need to register the `beforeEach` hook in `.storybook/preview.ts`.

```ts
// .storybook/preview.tsx
import { storybookPreviewVis } from 'storybook-addon-vis'

export default {
	// ...
	beforeEach: storybookPreviewVis.beforeEach
}
```

## Usage - automatic snapshot

With the `basic` preset, [storybook-addon-vis] automatically captures image snapshot for stories with `snapshot` tag.

As with how tags work in [storybook], you can add the tag globally, per story file, or per story.

```ts
// .storybook/preview.tsx
export default {
	// Enable image snapshot for all stories
	tags: ['snapshot']
}

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
	// Enable image snapshot for all stories in this file
	tags: ['snapshot']
}

export const MyStory = {
	// Disable image snapshot for this story
	tags: ['!snapshot'],
	// ...
}
```

You can provide options to the `toMatchImageSnapshot` matcher using parameters.

```ts
import { defineSnapshotParam } from 'storybook-addon-vis'

export const MyStory = {
	parameters: defineSnapshotParam({
		failureThreshold: 70,
	})
	// ...
}
```

## Usage - manual snapshot

Besides automatic snapshot, you can capture image snapshot manually.

```ts
import { expect } from '@storybook/test'

// `page` and the like are proxies of `@vitest/browser/context` to work within storybook
import { page } from 'storybook-addon-vis'

export const PageSnapshot = {
	// typically you want to disable automatic snapshot when using manual snapshot
	tags: ['!snapshot'],
	// ...
	async play() {
		await expect(page.imageSnapshot()).toMatchImageSnapshot()
	}
}

export const ElementSnapshot = {
	// typically you want to disable automatic snapshot when using manual snapshot
	tags: ['!snapshot'],
	// ...
	async play({ canvas }) {
		const element = await canvas.getByTestid('subject')
		await expect(page.imageSnapshot({ element })).toMatchImageSnapshot()
	}
}
```

## Snapshot folder

The snapshots are stored under the `__vis__` folder next to the test/story file:

```sh
├── __vis__
	├── __diff_output__ # where the diff images are stored
	├── __result__ # where the resulting snapshot of the current run are stored
	├── darwin # snapshot generated on macos by CI
	├── linux # snapshot generated on linux by CI
	├── local # snapshot generated on local machine
		└── story.tsx
			├── snapshot-1.png
			├── snapshot-2.png
			└── ...
└── story.tsx
```

This is a similar approach to [playwright]'s `page.screenshot()` which saves the screenshots under the `__screenshot__` folder.

This is different from [jest-image-snapshot] which stores the snapshots under the `__snapshots__` folder at the root of the project.

The reason for this is we need to support both [storybook] stories and [vitest] tests at the same time.
Stories have a unique ID enforced by [storybook], and [jest-image-snapshot] uses it to uniquely identify the snapshots.
This makes it possible to store the snapshots in the same folder.

With [vitest] tests, we don't have such unique ID (that is stable across runs and humanly readable),
meaning we have to retain the folder structure to uniquely identify the snapshots.
This makes the single folder approach much less attractive.

You can change the snapshot folder by providing the `snapshotDir` option to the `createVisConfig` function.

```ts
import { createVisConfig } from 'storybook-addon-vis/vitest-setup'

createVisConfig({
	snapshotDir: 'path/to/snapshot'
})
```

### .gitignore snapshot folders

Some snapshot folders should be ignored by git.

With the default snapshot folder structure, you might want to add the following to your `.gitignore`:

```sh
**/__vis__/*/__diff_output__
**/__vis__/*/__results__
**/__vis__/local
```

[jest-image-snapshot]: https://github.com/americanexpress/jest-image-snapshot
[playwright]: https://playwright.dev/docs/screenshots
[storybook-addon-vis]: https://github.com/repobuddy/storybook-addon-vis
[storybook]: https://storybook.js.org
[vitest]: https://vitest.dev/

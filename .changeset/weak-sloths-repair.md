---
"storybook-addon-vis": patch
---

Change `shouldTakeSnapshot(ctx)` to accept `any`.
Check is done at runtime.
This change allows the user to skip the type parameter in `afterEach` hook.

```ts
// from
import { StoryContext } from '@storybook/react'
import { shouldTakeSnapshot } from 'storybook-addon-vis/vitest-setup'
import { afterEach } from 'vitest'

afterEach<{ story?: StoryContext }>(async (ctx) => {
	if (!shouldTakeSnapshot(ctx)) return
	// ...
})

// to
afterEach(async (ctx) => {
	if (!shouldTakeSnapshot(ctx)) return
	// ...
})
```

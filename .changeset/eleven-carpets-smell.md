---
"storybook-addon-vis": minor
---

Refactor `configureSnapshotBeforeAll()` into `setupVitestVis()`.

```ts
// from
import { configureSnapshotBeforeAll } from 'storybook-addon-vis'
import { beforeAll } from 'vitest'

beforeAll(configureSnapshotBeforeAll)

// to
import { setupVitestVis } from 'storybook-addon-vis'
import { beforeAll } from 'vitest'

const vis = setupVitestVis()

beforeAll(vis.beforeAll)
```

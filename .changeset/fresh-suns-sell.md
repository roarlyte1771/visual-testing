---
"storybook-addon-vis": minor
---

Change `getSnapshotPlatform()` to return `local` when not on CI.
This is the best setup I have found so far to make the snapshot test work on both local and CI.

Set default snapshot path with `getSnapshoPlatform` function.


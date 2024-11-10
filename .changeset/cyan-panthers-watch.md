---
"storybook-addon-vis": minor
---

Change snapshot folder to `__vis__` next to the story/test file.
This avoids conflict when there are multiple story/test files with the same name in different folder.

The `createVisConfig({ snapshotPath })` is renamed to `snapshotDir`.

---
"storybook-addon-vis": patch
---

Use `Object.create(null)` instead of `{}` to avoid prototype pollution.


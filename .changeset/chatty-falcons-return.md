---
"storybook-addon-vis": patch
---

Move `expect.extends` to module scope.
It technically becomes a load time side effect which is not ideal,
but at the same time avoids doing the extends on every test file.

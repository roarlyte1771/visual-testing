import { defineWorkspace } from 'vitest/config'

export default defineWorkspace(['./packages/*', './testcases/*', './packages/vis/vitest.config.node.ts'])

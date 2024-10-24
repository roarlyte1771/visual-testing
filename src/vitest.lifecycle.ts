import { beforeAll, beforeEach } from 'vitest'
import { page } from './@vitest/browser/context.js'
import { imageSnapshot } from './@vitest/browser/page.image_snapshot.js'
import { state } from './state.js'

beforeAll((suite) => {
	page.extend({ imageSnapshot })
	state.name = suite.name
	state.filepath = suite.file.filepath
})

beforeEach((ctx) => {
	state.taskName = ctx.task.name
	state.snapshot[state.taskName] = state.snapshot[state.taskName] ?? { index: 1 }
})

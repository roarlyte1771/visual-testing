import { beforeAll, beforeEach, expect } from 'vitest'
import { page } from './@vitest/browser/context.js'
import { imageSnapshot } from './@vitest/browser/page.image_snapshot.js'
import { toMatchImageSnapshot } from './expect.to_match_image_snapshot.js'
import { state } from './state.js'

beforeAll((suite) => {
	page.extend({ imageSnapshot })
	expect.extend({ toMatchImageSnapshot })
	state.name = suite.name
	state.filepath = suite.file.filepath
})

beforeEach((ctx) => {
	state.taskName = ctx.task.name
	state.snapshot[state.taskName] = state.snapshot[state.taskName] ?? { index: 1 }
})

import { basename, dirname, join, relative } from 'pathe'
import { beforeAll, beforeEach, expect } from 'vitest'
import { commands, page } from './@vitest/browser/context.js'
import { imageSnapshot } from './@vitest/browser/page.image_snapshot.js'
import { toMatchImageSnapshot } from './expect.to_match_image_snapshot.js'
import { state } from './state.js'

beforeAll((suite) => {
	page.extend({ imageSnapshot })
	expect.extend({ toMatchImageSnapshot })
	state.name = suite.name
	state.testFilepath = suite.file.filepath
	state.testFilename = basename(state.testFilepath)
	state.projectDir = state.testFilepath.slice(0, -state.name.length)
	const currentDir = dirname(state.testFilepath)
	state.baselineDir = relative(currentDir, join(state.projectDir, '__snapshots__'))
	state.resultDir = relative(currentDir, join(state.projectDir, '__snapshots__', '__results__'))
	state.diffDir = relative(currentDir, join(state.projectDir, '__snapshots__', '__diff_output__'))
})

beforeEach((ctx) => {
	state.taskName = ctx.task.name
	state.snapshot[state.taskName] = state.snapshot[state.taskName] ?? { index: 1 }
})

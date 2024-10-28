import { basename, dirname, join, relative } from 'pathe'
import { expect } from 'vitest'
import './augment.js'
import { toMatchImageSnapshot } from './expect.to_match_image_snapshot.js'
import { state } from './state.js'

export * from './@vitest/browser/context.js'
export * from './tags.js'

expect.extend({ toMatchImageSnapshot })

export function configureSnapshotBeforeAll(suite: { file: { filepath: string }; name: string }) {
	state.name = suite.name
	state.testFilepath = suite.file.filepath
	state.testFilename = basename(state.testFilepath)
	state.projectDir = state.testFilepath.slice(0, -state.name.length)
	const currentDir = dirname(state.testFilepath)
	state.baselineDir = relative(currentDir, join(state.projectDir, '__snapshots__'))
	state.resultDir = relative(currentDir, join(state.projectDir, '__snapshots__', '__results__'))
	state.diffDir = relative(currentDir, join(state.projectDir, '__snapshots__', '__diff_output__'))
}

export function configureSnapshotBeforeEach(ctx: { task: { name: string } }) {
	state.taskName = ctx.task.name
	state.snapshot[state.taskName] = state.snapshot[state.taskName] ?? { index: 1 }
}

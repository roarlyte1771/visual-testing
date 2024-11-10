import { basename, dirname, join, relative } from 'pathe'
import type { StoryContext } from 'storybook/internal/types'
import { omit, required } from 'type-plus'
import { getCurrentTest } from 'vitest/suite'
import { commands } from './@vitest/browser/context.js'
import { toSnapshotId } from './@vitest/browser/image_snapshot.logic'
import type { ImageSnapshotOptions } from './@vitest/browser/types'
import type { MatchImageSnapshotOptions } from './expect.to_match_image_snapshot'
import type { VisOptions } from './types.js'

function createStore() {
	// test suite (runner.beforeAll) states
	let name: string
	let testFilepath: string
	let testFilename: string
	let baselineDir: string
	let resultDir: string
	let diffDir: string
	let snapshot: Record<string, Record<string, { index: number }>>
	let suiteOptions: VisOptions = {}

	// story states (story.beforeEach)
	let tags: string[] | undefined
	let parameters: Record<string, any> | undefined
	let taskName: string
	let id: string

	const state = {
		baselineDir,
		resultDir,
		diffDir,
		snapshot: {},
		async setupSuite(suite: { file: { filepath: string }; name: string }, options?: VisOptions) {
			name = suite.name
			testFilepath = suite.file.filepath
			testFilename = basename(testFilepath)
			const projectDir = testFilepath.slice(0, -name.length)
			const snapshotPath = join(
				projectDir,
				options?.snapshotPath ?? `__snapshots__/${await commands.getSnapshotPlatform()}`,
			)
			const currentDir = dirname(testFilepath)
			baselineDir = relative(currentDir, join(snapshotPath, testFilename))
			resultDir = relative(currentDir, join(snapshotPath, '__results__', testFilename))
			diffDir = relative(currentDir, join(snapshotPath, '__diff_output__', testFilename))

			suiteOptions = options ?? {}
			snapshot = snapshot ?? {}
			if (!snapshot[testFilepath]) {
				snapshot[testFilepath] = {}
				await commands.rmDir(resultDir)
				await commands.rmDir(diffDir)
			}
		},
		setupStory(ctx: StoryContext) {
			tags = ctx.tags
			parameters = ctx.parameters
		},
		shouldTakeSnapshot() {
			if (!tags) return false
			return tags.lastIndexOf('!snapshot') < tags.lastIndexOf('snapshot')
		},
		getName() {
			return taskName
		},
		getTimeout(timeout?: number | undefined) {
			return timeout ?? suiteOptions.timeout ?? 30000
		},
		mergeMatchImageSnapshotOptions(options?: MatchImageSnapshotOptions) {
			return required(omit(suiteOptions, 'snapshotPath'), parameters?.snapshot, options)
		},
		getSnapshotFilePaths(options?: ImageSnapshotOptions | undefined) {
			const test = getCurrentTest()
			taskName = test.name
			id = toSnapshotId(taskName)
			snapshot[testFilepath][id] = snapshot[testFilepath][id] ?? { index: 1 }

			const index = snapshot[testFilepath][id]!.index
			const customizeSnapshotId =
				suiteOptions.customizeSnapshotId ?? options?.customizeSnapshotId ?? ((id, index) => `${id}-${index}`)
			const snapshotFilename = `${customizeSnapshotId(id, index)}.png`
			const baselinePath = join(baselineDir, snapshotFilename)
			const resultPath = join(resultDir, snapshotFilename)
			const diffPath = join(diffDir, snapshotFilename)
			return { snapshotFilename, baselinePath, resultPath, diffPath }
		},
		incrementSnapshotIndex() {
			snapshot[testFilepath][id]!.index++
		},
	}
	return state
}

export const state = createStore()

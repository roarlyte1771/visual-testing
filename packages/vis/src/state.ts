import { basename, dirname, join, relative } from 'pathe'
import type { StoryContext } from 'storybook/internal/types'
import { required } from 'type-plus'
import { getCurrentTest } from 'vitest/suite'
import { commands } from './@vitest/browser/context.js'
import { toSnapshotId } from './@vitest/browser/image_snapshot.logic'
import type { ImageSnapshotOptions } from './@vitest/browser/types'
import type { MatchImageSnapshotOptions } from './expect.to_match_image_snapshot'
import type { VisOptions } from './types.js'

function createStore() {
	let suiteOptions: VisOptions = {}

	const state = {
		name: '',
		testFilepath: '',
		taskName: '',
		snapshot: {},
		async setupSuite(suite: { file: { filepath: string }; name: string }, options?: VisOptions) {
			state.name = suite.name
			state.testFilepath = suite.file.filepath
			state.testFilename = basename(state.testFilepath)
			state.projectDir = state.testFilepath.slice(0, -state.name.length)
			const snapshotPath = join(
				state.projectDir,
				options?.snapshotPath ?? `__snapshots__/${await commands.getSnapshotPlatform()}`,
			)
			const currentDir = dirname(state.testFilepath)
			state.baselineDir = relative(currentDir, join(snapshotPath, state.testFilename))
			state.resultDir = relative(currentDir, join(snapshotPath, '__results__', state.testFilename))
			state.diffDir = relative(currentDir, join(snapshotPath, '__diff_output__', state.testFilename))

			suiteOptions = options

			if (!state.snapshot[state.testFilepath]) {
				state.snapshot[state.testFilepath] = {}
				await commands.rmDir(state.resultDir)
				await commands.rmDir(state.diffDir)
			}
		},
		setupStory(ctx: StoryContext) {
			state.tags = ctx.tags
			state.parameters = ctx.parameters
		},
		shouldTakeSnapshot() {
			if (!state.tags) return false
			return state.tags.lastIndexOf('!snapshot') < state.tags.lastIndexOf('snapshot')
		},
		getTimeout(timeout?: number | undefined) {
			return timeout ?? suiteOptions?.timeout ?? 3000
		},
		mergeMatchImageSnapshotOptions(options?: MatchImageSnapshotOptions) {
			return required(state.parameters?.snapshot, options)
		},
		getSnapshotFilePaths(options?: ImageSnapshotOptions | undefined) {
			const test = getCurrentTest()
			state.taskName = test.name
			const id = (state.id = toSnapshotId(state.taskName))
			state.snapshot[state.testFilepath][id] = state.snapshot[state.testFilepath][id] ?? { index: 1 }

			const index = state.snapshot[state.testFilepath][state.id]!.index
			const snapshotFilename = options?.customizeSnapshotId
				? `${options.customizeSnapshotId(state.id, index)}.png`
				: `${state.id}-${index}.png`
			const baselinePath = join(state.baselineDir, snapshotFilename)
			const resultPath = join(state.resultDir, snapshotFilename)
			const diffPath = join(state.diffDir, snapshotFilename)
			return { snapshotFilename, baselinePath, resultPath, diffPath }
		},
		incrementSnapshotIndex() {
			state.snapshot[state.testFilepath][state.id]!.index++
		},
	} as unknown as {
		id: string
		name: string
		testFilepath: string
		testFilename: string
		projectDir: string
		baselineDir: string
		resultDir: string
		diffDir: string
		taskName: string
		parameters: {
			snapshot?: MatchImageSnapshotOptions | undefined
			[key: string]: any
		}
		tags: string[]
		snapshot: Record<string, Record<string, { index: number }>>
		shouldTakeSnapshot(): boolean
		getSnapshotFilePaths(options?: ImageSnapshotOptions | undefined): {
			snapshotFilename: string
			baselinePath: string
			resultPath: string
			diffPath: string
		}
		getTimeout(timeout?: number | undefined): number
		mergeMatchImageSnapshotOptions(options?: MatchImageSnapshotOptions): MatchImageSnapshotOptions
		incrementSnapshotIndex(): void
		setupSuite(suite: { file: { filepath: string }; name: string }, options?: VisOptions): Promise<void>
		setupStory(ctx: StoryContext): void
	}
	return state
}

export const state = createStore()

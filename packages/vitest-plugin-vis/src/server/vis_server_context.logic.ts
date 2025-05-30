import { basename, join, resolve } from 'pathe'
import { pick } from 'type-plus'
import type { ImageSnapshotKeyOptions } from '../client-api.ts'
import type { ImageSnapshotResult } from './commands/load_image_snapshot_results.ts'
import { file } from './externals/file.ts'
import { getSuite, getTaskSubpath } from './suite.ts'
import { getVisOption } from './vis_options.ts'
import type { PartialBrowserCommandContext } from './vis_server_context.types.ts'

export function createVisServerContext() {
	const context = {
		async getSnapshotResults(browserContext: PartialBrowserCommandContext, taskId: string) {
			const suiteInfo = await context.getSuiteInfo(browserContext, taskId)
			const baselines = await file.glob(join(suiteInfo.projectRoot, suiteInfo.baselineDir, `${suiteInfo.taskId}-*.png`))
			const results = await file.glob(join(suiteInfo.projectRoot, suiteInfo.resultDir, `${suiteInfo.taskId}-*.png`))
			const diffs = await file.glob(join(suiteInfo.projectRoot, suiteInfo.diffDir, `${suiteInfo.taskId}-*.png`))

			const r: ImageSnapshotResult[] = []
			await Promise.all(
				baselines.map(async (baselinePath) => {
					const filename = basename(baselinePath)
					const resultPath = results.find((r) => r.endsWith(filename))
					const diffPath = diffs.find((d) => d.endsWith(filename))

					const baselineBuffer = await file.tryReadFile(baselinePath)
					const resultBuffer = await file.tryReadFile(resultPath)
					const diffBuffer = await file.tryReadFile(diffPath)
					r.push({
						filename,
						baseline: baselineBuffer?.toString('base64'),
						result: resultBuffer?.toString('base64'),
						diff: diffBuffer?.toString('base64'),
					})
				}),
			)
			return r
		},
		async getSnapshotInfo(
			browserContext: PartialBrowserCommandContext,
			taskId: string,
			options?: ImageSnapshotKeyOptions,
		) {
			const suiteInfo = await context.getSuiteInfo(browserContext, taskId)
			const snapshotFilename = context.getSnapshotFilename(browserContext, suiteInfo, options?.snapshotKey)

			const { baselineDir, resultDir, diffDir, task } = suiteInfo

			task.count = task.count + 1
			const baselinePath = join(baselineDir, snapshotFilename)
			const resultPath = join(resultDir, snapshotFilename)
			const diffPath = join(diffDir, snapshotFilename)

			return {
				...pick(
					getVisOption(browserContext),
					'comparisonMethod',
					'diffOptions',
					'failureThreshold',
					'failureThresholdType',
					'timeout',
				),
				baselinePath,
				resultPath,
				diffPath,
			}
		},

		async getTaskCount(browserContext: PartialBrowserCommandContext, taskId: string) {
			return (await context.getSuiteInfo(browserContext, taskId)).task.count
		},
		async hasImageSnapshot(
			browserContext: PartialBrowserCommandContext,
			taskId: string,
			snapshotKey: string | undefined,
		) {
			const info = await context.getSuiteInfo(browserContext, taskId)

			return file.existFile(
				resolve(info.projectRoot, info.baselineDir, context.getSnapshotFilename(browserContext, info, snapshotKey)),
			)
		},
		getSnapshotFilename(
			browserContext: PartialBrowserCommandContext,
			info: { taskId: string; task: { count: number } },
			snapshotKey: string | undefined,
		) {
			if (snapshotKey) return `${info.taskId}-${snapshotKey}.png`
			const visOptions = getVisOption(browserContext)
			if (typeof visOptions.snapshotKey === 'string') {
				return `${info.taskId}-${visOptions.snapshotKey}.png`
			}
			return `${info.taskId}-${info.task.count}.png`
		},
		async getSuiteInfo(browserContext: PartialBrowserCommandContext, taskId: string) {
			const projectState = await getSuite(browserContext)
			const visOptions = getVisOption(browserContext)
			const moduleId = getTaskSubpath(projectState, browserContext.testPath, visOptions)
			const m = projectState.modules[moduleId]!
			const task = (m.tasks[taskId] = m.tasks[taskId] ?? { count: 1 })
			return {
				projectRoot: projectState.projectRoot,
				suiteId: moduleId,
				taskId,
				baselineDir: m.baselineDir,
				resultDir: m.resultDir,
				diffDir: m.diffDir,
				task,
			}
		},
	}
	return context
}

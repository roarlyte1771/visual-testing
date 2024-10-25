import type { BrowserPage } from '@vitest/browser/context'
import { basename, join } from 'pathe'
import { toImageData } from '../../image_data.js'
import { state } from '../../state.js'
import { type ImageSnapshot, type ImageSnapshotOptions, imageSnapshotSymbol } from '../../vitest-plugin/types.js'
import { server } from './context.js'

export async function imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions): Promise<ImageSnapshot> {
	const rootDir = server.config.root
	const testfilename = basename(state.testFilepath)
	const snapshotFilename = `${toId(state.taskName)}-${state.snapshot[state.taskName]!.index++}.png`
	const baselinePath = join(state.baselineDir, testfilename, snapshotFilename)
	const resultPath = join(state.resultDir, testfilename, snapshotFilename)
	const diffPath = join(state.diffDir, testfilename, snapshotFilename)
	const screenshot = await this.screenshot({
		base64: true,
		path: resultPath,
		element: options?.element,
	})
	const image = await toImageData(screenshot.base64)

	return {
		type: imageSnapshotSymbol,
		rootDir,
		testfilename,
		snapshotFilename,
		baselinePath,
		resultPath,
		diffPath,
		base64: screenshot.base64,
		image,
	}
}

export function toId(taskName: string) {
	return `${taskName.replace(/[^a-z0-9]/gi, '-')}`
}

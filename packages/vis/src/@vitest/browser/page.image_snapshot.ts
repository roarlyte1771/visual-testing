import type { BrowserPage } from '@vitest/browser/context'
import { basename, join } from 'pathe'
import { toImageData } from '../../image_data.js'
import { state } from '../../state.js'
import { imageSnapshotSymbol } from './constants.js'
import { toSnapshotId } from './image_snapshot.logic.js'
import type { ImageSnapshot, ImageSnapshotOptions } from './types.js'

export async function imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions): Promise<ImageSnapshot> {
	// const rootDir = server.config.root
	const testfilename = basename(state.testFilepath)
	const snapshotFilename = `${toSnapshotId(state.taskName)}-${state.snapshot[state.taskName]!.index++}.png`
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
		// rootDir,
		testfilename,
		snapshotFilename,
		baselinePath,
		resultPath,
		diffPath,
		base64: screenshot.base64,
		image,
	}
}

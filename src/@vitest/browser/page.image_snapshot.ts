import type { BrowserPage } from '@vitest/browser/context'
import { basename } from 'pathe'
import { toImageData } from '../../image_data.js'
import { state } from '../../state.js'
import { server } from './context.js'
import { type ImageSnapshot, type ImageSnapshotOptions, imageSnapshotSymbol } from './types.js'

export async function imageSnapshot(this: BrowserPage, _options?: ImageSnapshotOptions): Promise<ImageSnapshot> {
	const rootDir = server.config.root
	const testfilename = basename(state.filepath)
	const snapshotFilename = `${toId(state.taskName)}-${state.snapshot[state.taskName]!.index++}.png`
	const baselinePath = `__screenshots__/${testfilename}/${snapshotFilename}`
	const resultPath = `__screenshots__/${testfilename}/__results__/${snapshotFilename}`
	const diffPath = `__screenshots__/${testfilename}/__diffs__/${snapshotFilename}`
	const screenshot = await this.screenshot({
		base64: true,
		path: resultPath,
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

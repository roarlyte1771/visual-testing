// import type { Locator } from '@vitest/browser/context'
import type { PixelmatchOptions } from 'pixelmatch'

export type ImageSnapshotOptions = {
	element?: Element //| Locator
}

export type ImageSnapshot = {
	type: symbol
	// rootDir: string
	testfilename: string
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
	base64: string
	image: ImageData
}

export type MatchImageSnapshotOptions = {
	diffOptions?: PixelmatchOptions | undefined
	failureThreshold?: number | undefined
	failureThresholdType?: 'pixel' | 'percent' | undefined
}

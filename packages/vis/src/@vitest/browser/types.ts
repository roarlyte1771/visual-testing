// import type { Locator } from '@vitest/browser/context'
import type { PixelmatchOptions } from 'pixelmatch'

export type ImageSnapshotOptions = {
	/**
	 * Customize the snapshot id. This is used as the filename of the snapshot:
	 *
	 * `${snapshotId}.png`
	 *
	 * @param id The id of the snapshot.
	 * @param index The index of the snapshot.
	 */
	customizeSnapshotId?: (id: string, index: number) => string
	element?: Element //| Locator
}

export type ImageSnapshot = {
	type: symbol
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
	base64: string
	image: ImageData
}

export type MatchImageSnapshotOptions = {
	/**
	 * Custom options passed to 'pixelmatch'
	 */
	diffOptions?: PixelmatchOptions | undefined
	/**
	 * Failure threshold should measure in `pixel` or `percent`.
	 *
	 * Default is `pixel`.
	 */
	failureThresholdType?: 'pixel' | 'percent' | undefined
	failureThreshold?: number | undefined
}

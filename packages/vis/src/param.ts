import type { PixelmatchOptions } from 'pixelmatch'

export type SnapshotStoryParam = {
	/**
	 * Add a delay to the story snapshot comparison to allow for async rendering.
	 *
	 * This only apply to the automatic snapshot taken when the story is rendered.
	 * In general, it's a good idea to not rely on this delay,
	 * and instead use the make sure your component is fully rendered before the `play()` function returns.
	 */
	delay?: number | undefined
	/**
	 * The method by which images are compared.
	 * `pixelmatch` does a pixel by pixel comparison, whereas `ssim` does a structural similarity comparison.
	 * @default 'pixelmatch'
	 */
	comparisonMethod?: 'pixelmatch' | 'ssim' | undefined
	/**
	 * Custom config passed to 'pixelmatch' or 'ssim'
	 */
	customDiffConfig?: PixelmatchOptions | undefined
	failureThreshold?: number | undefined
	failureThresholdType?: 'percent' | 'pixel' | undefined
	blur?: number | undefined
}

export function defineSnapshotParam(snapshot: SnapshotStoryParam) {
	return { snapshot }
}

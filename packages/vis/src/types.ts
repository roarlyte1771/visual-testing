import type { MatchImageSnapshotOptions } from './expect.to_match_image_snapshot'

/**
 * The project parameters for the snapshot.
 *
 * These parameters are set per project in the `.storybook/preview.ts` file.
 */
export interface VisOptions extends MatchImageSnapshotOptions {
	/**
	 * The snapshot folder relative to the root of the project.
	 */
	snapshotPath?: string | undefined
	timeout?: number | undefined
}

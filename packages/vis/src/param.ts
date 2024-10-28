import type { MatchImageSnapshotOptions } from './@vitest/browser/types'

export function defineSnapshotParam(snapshot: MatchImageSnapshotOptions) {
	return { snapshot }
}

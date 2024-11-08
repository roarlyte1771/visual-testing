import type { MatchImageSnapshotOptions } from './expect.to_match_image_snapshot'

export const state = {
	name: '',
	testFilepath: '',
	taskName: '',
	snapshot: {},
} as {
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
	snapshot: Record<string, Record<string, { index: number }>>
}

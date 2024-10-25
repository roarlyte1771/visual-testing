export const state = {
	name: '',
	testFilepath: '',
	taskName: '',
	snapshot: {},
} as {
	name: string
	testFilepath: string
	testFilename: string
	projectDir: string
	baselineDir: string
	resultDir: string
	diffDir: string
	taskName: string
	snapshot: Record<string, { index: number }>
}

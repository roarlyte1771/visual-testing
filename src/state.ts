
export const state = {
	name: '',
	filepath: '',
	taskName: '',
	snapshot: {},
} as {
	name: string
	filepath: string
	taskName: string
	snapshot: Record<string, { index: number }>
}

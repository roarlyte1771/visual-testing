import ci from 'is-ci'
import type { BrowserCommand } from 'vitest/node'

export const getSnapshotPlatform: BrowserCommand<[]> = async () => {
	return `${process.platform}${ci ? '-ci' : ''}`
}

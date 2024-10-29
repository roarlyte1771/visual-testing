import ci from 'is-ci'
import type { BrowserCommand } from 'vitest/node'

export const isCI: BrowserCommand<[]> = async () => {
	return ci
}

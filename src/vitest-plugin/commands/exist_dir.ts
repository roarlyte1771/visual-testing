import { stat } from 'node:fs/promises'
import { dirname, join } from 'pathe'
// import type { BrowserCommand } from 'vitest/node'

export const existDir = async ({ testPath, provider }: any, path: string) => {
	if (provider.name === 'playwright') {
		return stat(join(dirname(testPath), path))
			.then((s) => s.isDirectory())
			.catch(() => false)
	}

	throw new Error(`provider ${provider.name} is not supported`)
}

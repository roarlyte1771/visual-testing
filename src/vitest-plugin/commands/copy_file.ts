import { copyFile as copyFileFs } from 'node:fs/promises'
import { dirname, join } from 'pathe'
import type { BrowserCommand } from 'vitest/node'

export const copyFile: BrowserCommand<[src: string, dest: string]> = async ({ testPath, provider }, src, dest) => {
	if (provider.name === 'playwright') {
		return copyFileFs(join(dirname(testPath), src), join(dirname(testPath), dest))
	}

	throw new Error(`provider ${provider.name} is not supported`)
}

import type { Plugin } from 'vitest/config'
import { existDir } from './commands/exist_dir.js'
import './types.js'

export function storybookVis(): Plugin {
	return {
		name: 'vitest:storybook-vis',
		config() {
			return {
				test: {
					browser: {
						name: undefined,
						commands: {
							existDir,
						},
					},
				},
			}
		},
	}
}

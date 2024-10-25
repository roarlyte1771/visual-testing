import type { Plugin } from 'vitest/config'
import { existDir } from './vitest-plugin/commands/exist_dir.js'
import './vitest-plugin/types.js'
import { copyFile } from './vitest-plugin/commands/copy_file.js'

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
							copyFile,
						},
					},
				},
			}
		},
	}
}

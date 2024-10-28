import type { Preview } from '@storybook/react'
import { expect } from '@storybook/test'
import { toMatchImageSnapshot } from '../src/index.js'

expect.extend({ toMatchImageSnapshot })

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	initialGlobals: {
		background: { value: 'light' },
	},
}

export default preview

import type { Preview } from '@storybook/react'
import { expect } from '@storybook/test'
import { toMatchImageSnapshot, visStorybookPreview } from '../src/index.js'

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
	beforeEach: visStorybookPreview.beforeEach,
}

export default preview

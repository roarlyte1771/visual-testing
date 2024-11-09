import { storybookPreviewVis } from 'storybook-addon-vis'

/** @type { import('@storybook/react').Preview } */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	beforeEach: storybookPreviewVis.beforeEach,
	tags: ['snapshot'],
}

export default preview

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
	tags: ['snapshot'],
	beforeEach: storybookPreviewVis.beforeEach,
}

export default preview

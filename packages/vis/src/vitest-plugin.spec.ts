import { storybookVis } from './vitest-plugin'

it('name as `vitest:storybook-addon-vis`', () => {
	const plugin = storybookVis()
	expect(plugin.name).toBe('vitest:storybook-vis')
})

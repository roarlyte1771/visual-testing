import type { Meta, StoryObj } from '@storybook/react'
import { expect } from '@storybook/test'
import { page } from './context.js'

export default {
	title: 'page.imageSnapshot',
	render: () => <>unit test</>,
} as Meta

export const IsStubbed: StoryObj = {
	async play() {
		expect(page.imageSnapshot).toBeDefined()
	},
}

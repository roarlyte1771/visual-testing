import type { Meta, StoryObj } from '@storybook/react'

export default {
	title: 'per story',
	render: () => <>unit test</>,
} satisfies Meta

export const TakeSnapshot: StoryObj = {
	tags: ['snapshot'],
}

export const SkipSnapshot: StoryObj = {
	tags: ['!snapshot'],
}

export const LastWin: StoryObj = {
	tags: ['!snapshot', 'snapshot'],
}

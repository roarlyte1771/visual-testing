import type { StoryContext } from '@storybook/react'

export function shouldTakeSnapshot(ctx: { story?: StoryContext }) {
	if (!ctx.story?.tags) return false
	return ctx.story.tags.lastIndexOf('!snapshot') < ctx.story.tags.lastIndexOf('snapshot')
}

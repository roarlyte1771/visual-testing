import type { ProjectAnnotations, Renderer, StoryContext } from 'storybook/internal/types'
import { state } from '../state'

export const visStorybookPreview: ProjectAnnotations<Renderer> = {
	beforeEach(ctx: StoryContext) {
		state.parameters = ctx.parameters
	},
}

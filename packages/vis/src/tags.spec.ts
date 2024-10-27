import type { StoryContext } from '@storybook/react'
import type { RecursivePartial } from 'type-plus'
import { shouldTakeSnapshot } from './tags'

it('returns false if it is not a story', () => {
	expect(shouldTakeSnapshot(stubTestContext())).toBe(false)
})

it('returns false if it is a story without tags', () => {
	expect(shouldTakeSnapshot(stubTestContext({ story: {} }))).toBe(false)
})

it('returns true if it has `snapshot` tag', () => {
	expect(shouldTakeSnapshot(stubTestContext({ story: { tags: ['snapshot'] } }))).toBe(true)
})

it('returns false if it has no `snapshot` tag', () => {
	expect(shouldTakeSnapshot(stubTestContext({ story: { tags: [] } }))).toBe(false)
})

it('returns false if it has `!snapshot` tag', () => {
	expect(shouldTakeSnapshot(stubTestContext({ story: { tags: ['snapshot', '!snapshot'] } }))).toBe(false)
})

it('returns true if it has `snapshot` tag after `!snapshot` tags', () => {
	expect(shouldTakeSnapshot(stubTestContext({ story: { tags: ['!snapshot', 'snapshot'] } }))).toBe(true)
	expect(shouldTakeSnapshot(stubTestContext({ story: { tags: ['snapshot', '!snapshot', 'snapshot'] } }))).toBe(true)
})

function stubTestContext(ctx: RecursivePartial<{ story: StoryContext }> = {}) {
	return ctx as { story?: StoryContext }
}

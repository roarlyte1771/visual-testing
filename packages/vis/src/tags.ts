/**
 * Determine should snapshot be taken.
 *
 * not story: false
 * no `snapshot` tag: false
 * disabled by `!snapshot` tag: false
 */
export function shouldTakeSnapshot(ctx: any) {
	if (!ctx.story?.tags || !Array.isArray(ctx.story.tags)) return false
	return ctx.story.tags.lastIndexOf('!snapshot') < ctx.story.tags.lastIndexOf('snapshot')
}

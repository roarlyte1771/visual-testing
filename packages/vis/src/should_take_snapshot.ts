import { state } from './state'

/**
 * Determine should snapshot be taken.
 *
 * not story: false
 * no `snapshot` tag: false
 * disabled by `!snapshot` tag: false
 */
export function shouldTakeSnapshot() {
	if (!state.tags) return false
	return state.tags.lastIndexOf('!snapshot') < state.tags.lastIndexOf('snapshot')
}

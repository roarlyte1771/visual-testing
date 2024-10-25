import { type ImageSnapshot, imageSnapshotSymbol } from './@vitest/browser/types'

export function isImageSnapshot(subject: any): subject is ImageSnapshot {
	return !!subject && subject.type === imageSnapshotSymbol
}

export function assertImageSnapshot(subject: any): asserts subject is ImageSnapshot {
	if (!isImageSnapshot(subject)) {
		throw new Error('Expected subject to be an image snapshot')
	}
}

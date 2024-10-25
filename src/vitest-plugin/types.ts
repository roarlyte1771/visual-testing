// import type { Locator } from '@vitest/browser/context'
///  <reference types="@vitest/browser/context" />

export const imageSnapshotSymbol = Symbol('imageSnapshot')

declare module '@vitest/browser/context' {
	interface BrowserPage {
		imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions): Promise<ImageSnapshot>
	}
	interface BrowserCommands {
		existDir: (path: string) => Promise<boolean>
	}
}

export type ImageSnapshotOptions = {
	element?: Element //| Locator
}

export type ImageSnapshot = {
	type: typeof imageSnapshotSymbol
	rootDir: string
	testfilename: string
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
	base64: string
	image: ImageData
}

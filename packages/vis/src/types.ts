// import type { Locator } from '@vitest/browser/context'
///  <reference types="@vitest/browser/context" />

declare module '@vitest/browser/context' {
	interface BrowserPage {
		imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions): Promise<ImageSnapshot>
	}
	interface BrowserCommands {
		existDir: (path: string) => Promise<boolean>
		copyFile: (src: string, dest: string) => Promise<void>
	}
}

export type ImageSnapshotOptions = {
	element?: Element //| Locator
}

export type ImageSnapshot = {
	type: symbol
	rootDir: string
	testfilename: string
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
	base64: string
	image: ImageData
}

declare global {
	namespace jest {
		// biome-ignore lint/correctness/noUnusedVariables: augmentation must have matching type params.
		interface Matchers<R, T> {
			toMatchImageSnapshot(): void
		}
	}
}

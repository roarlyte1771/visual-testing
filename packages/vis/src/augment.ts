///  <reference types="@vitest/browser/context" />

import type { ImageSnapshot, ImageSnapshotOptions } from './@vitest/browser/types'

declare module '@vitest/browser/context' {
	interface BrowserPage {
		imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions): Promise<ImageSnapshot>
	}
	interface BrowserCommands {
		existDir: (path: string) => Promise<boolean>
		copyFile: (src: string, dest: string) => Promise<void>
	}
}

declare global {
	namespace jest {
		// biome-ignore lint/correctness/noUnusedVariables: augmentation must have matching type params.
		interface Matchers<R, T> {
			toMatchImageSnapshot(): void
		}
	}
}

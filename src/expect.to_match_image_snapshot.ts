import type { AsyncExpectationResult, MatcherState } from '@vitest/expect'
import pixelmatch from 'pixelmatch'
import { commands, page } from './@vitest/browser/context.js'
import { toDataURL, toImageData } from './image_data.js'
import { assertImageSnapshot, isImageSnapshot } from './image_snapshot.js'

declare global {
	namespace jest {
		// biome-ignore lint/correctness/noUnusedVariables: augmentation must have matching type params.
		interface Matchers<R, T> {
			toMatchImageSnapshot(): void
		}
	}
}

export async function toMatchImageSnapshot<T extends MatcherState = MatcherState>(
	this: T,
	actual: any,
): AsyncExpectationResult {
	const subject = await actual
	if (!isImageSnapshot(subject)) {
		if (subject?.path && subject?.base64) {
			return {
				pass: false,
				actual,
				message: () =>
					'`toMatchImageSnapshot()` expects the subject to be the result of `page.imageSnapshot()`, but seems like you are using `page.screenshot()`?',
			}
		}

		if (typeof subject !== 'object') {
			return {
				pass: false,
				actual,
				message: () =>
					`\`toMatchImageSnapshot()\` expects the subject to be an element, locator, or result of \`page.imageSnapshot()\`, but got: \`${actual}\``,
			}
		}
		//await page.imageSnapshot({ element: actual })
	}
	assertImageSnapshot(subject)
	const baseline = await tryReadSnapshot(subject.baselinePath)
	if (!baseline) {
		await page.screenshot({
			path: subject.baselinePath,
		})
	} else {
		const baselineImage = await toImageData(baseline)
		const diffData = new Uint8Array(baselineImage.width * baselineImage.height * 4)

		const pixelDiff = pixelmatch(
			subject.image.data,
			baselineImage.data,
			diffData,
			baselineImage.width,
			baselineImage.height,
		)
		if (pixelDiff > 0) {
			const diffImage = new ImageData(baselineImage.width, baselineImage.height)
			diffImage.data.set(diffData)
			const diff = (await toDataURL(diffImage)).split(',')[1]
			await writeSnapshot(`${subject.diffPath}`, diff!)
			return {
				pass: false,
				actual,
				message: () => `Image snapshot does not match the baseline. See the diff image at '${subject.diffPath}'`,
			}
		}
	}
	return {
		pass: true,
		message: () => '',
	}
}

function tryReadSnapshot(path: string) {
	return new Promise<string>((resolve) => resolve(commands.readFile(path, { encoding: 'base64' }))).catch(
		() => undefined,
	)
}
function writeSnapshot(path: string, content: string) {
	return commands.writeFile(path, content, 'base64url')
}

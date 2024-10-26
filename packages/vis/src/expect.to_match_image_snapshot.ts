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
		await commands.copyFile(subject.resultPath, subject.baselinePath)
		return success
	}

	const originalImage = await toImageData(baseline)
	const [resultImage, baselineImage] = alignImagesToSameSize(subject.image, originalImage)
	const { width, height } = resultImage
	const diffImage = new ImageData(width, height)

	const pixelDiff = pixelmatch(resultImage.data, baselineImage.data, diffImage.data, width, height)
	if (pixelDiff > 0) {
		await writeSnapshot(`${subject.diffPath}`, diffImage)
		return {
			pass: false,
			actual,
			message: () => `Image snapshot does not match the baseline. See the diff image at '${subject.diffPath}'`,
		}
	}
	return success
}

const success = {
	pass: true,
	message: () => '',
}

function tryReadSnapshot(path: string): Promise<string | undefined> {
	return commands.readFile(path, { encoding: 'base64' }).catch(() => undefined)
}
async function writeSnapshot(path: string, image: ImageData) {
	const content = (await toDataURL(image)).split(',')[1]!
	return commands.writeFile(path, content, 'base64url')
}

function alignImagesToSameSize(image1: ImageData, image2: ImageData): [image1: ImageData, image2: ImageData] {
	if (isSameSize(image1, image2)) {
		return [image1, image2]
	}
	const size = getMaxSize(image1, image2)
	const resize = createImageResizer(size)
	return [resize(image1), resize(image2)]
}

function getMaxSize(image1: ImageData, image2: ImageData) {
	const width = Math.max(image1.width, image2.width)
	const height = Math.max(image1.height, image2.height)
	return { width, height }
}

function isSameSize(image1: ImageData, image2: ImageData) {
	return image1.width === image2.width && image1.height === image2.height
}

const createImageResizer =
	({ width, height }: { width: number; height: number }) =>
	(image: ImageData) => {
		if (image.width === width && image.height === height) {
			return image
		}
		const inArea = (x: number, y: number) => y <= image.height && x <= image.width
		const result = new ImageData(width, height, { colorSpace: image.colorSpace })

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = (width * y + x) << 2
				if (inArea(x, y)) {
					const old = (image.width * y + x) << 2
					result.data[idx] = image.data[old]
					result.data[idx + 1] = image.data[old + 1]
					result.data[idx + 2] = image.data[old + 2]
					result.data[idx + 3] = image.data[old + 3]
				} else {
					result.data[idx] = 0
					result.data[idx + 1] = 0
					result.data[idx + 2] = 0
					result.data[idx + 3] = 64
				}
			}
		}
		return result
	}

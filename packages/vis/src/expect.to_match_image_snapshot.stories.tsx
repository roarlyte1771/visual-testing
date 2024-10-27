import type { Meta, StoryObj } from '@storybook/react'
import { page } from './@vitest/browser/context'
import { UNI_PNG_URL } from './testing/constants'

export default {
	title: 'expect.toMatchImageSnapshot',
} satisfies Meta

export const Success: StoryObj = {
	render() {
		return <img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
	},
	async play() {
		await expect(page.imageSnapshot()).toMatchImageSnapshot()
	},
}

export const Failed: StoryObj = {
	render() {
		return (
			<>
				<img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
				<img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
			</>
		)
	},
	async play() {
		await expect(() => expect(page.imageSnapshot()).toMatchImageSnapshot()).rejects.toThrowError(
			`Image snapshot does not match the baseline. See the diff image at '../__snapshots__/__diff_output__/expect.to_match_image_snapshot.stories.tsx/failed-1.png'`,
		)
	},
}

export const Element: StoryObj = {
	render() {
		return <img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
	},
	async play({ canvas }) {
		const image = await canvas.getByRole('img')
		await expect(page.imageSnapshot({ element: image })).toMatchImageSnapshot()
	},
}

export const DifferentSize: StoryObj = {
	render() {
		// return <img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
		return <img style={{ width: 256, height: 256 }} src={UNI_PNG_URL} />
	},
	async play({ canvas }) {
		const image = await canvas.getByRole('img')
		await expect(() => expect(page.imageSnapshot({ element: image })).toMatchImageSnapshot()).rejects.toThrowError(
			`Image snapshot does not match the baseline. See the diff image at '../__snapshots__/__diff_output__/expect.to_match_image_snapshot.stories.tsx/different-size-1.png'`,
		)
	},
}

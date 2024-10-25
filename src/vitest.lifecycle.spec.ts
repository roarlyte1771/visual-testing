import { composeStories } from '@storybook/react'
import { basename } from 'pathe'
import { expect, it } from 'vitest'
import { commands, page } from './@vitest/browser/context.js'
import * as ImageDataStories from './image_data.stories.js'

const { ConversionRoundtrip } = composeStories(ImageDataStories)

it.todo('should delete the results and diffs folder when the during `beforeAll`', async ({ task }) => {
	await expect(commands.existDir(`../__snapshots__/__diff_output__/${basename(task.file.name)}`)).resolves.toBe(false)
	await expect(commands.existDir(`../__snapshots__/__results__/${basename(task.file.name)}`)).resolves.toBe(false)
	await ConversionRoundtrip.run()
	await expect(page.imageSnapshot()).toMatchImageSnapshot()
})

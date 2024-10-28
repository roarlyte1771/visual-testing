import { composeStories } from '@storybook/react'
import { basename } from 'pathe'
import { expect, it } from 'vitest'
import { commands, page } from './@vitest/browser/context.js'
import * as ImageDataStories from './image_data.stories.js'
import { state } from './state.js'
import { configureSnapshotBeforeAll } from './vitest-setup.js'

const { ConversionRoundtrip } = composeStories(ImageDataStories)

it('should delete the results and diffs folder when the during `beforeAll`', async ({ task }) => {
	await expect(commands.existDir(`../__snapshots__/__diff_output__/${basename(task.file.name)}`)).resolves.toBe(false)
	await expect(commands.existDir(`../__snapshots__/__results__/${basename(task.file.name)}`)).resolves.toBe(false)
	await ConversionRoundtrip.run()
	await expect(page.imageSnapshot()).toMatchImageSnapshot()
})

it('can define the snapshot root folder relative to the root of the project', async () => {
	await configureSnapshotBeforeAll(
		{ name: 'name', file: { filepath: 'dummy/path' } },
		{
			snapshotPath: '_sp_',
		},
	),
		expect(state).toMatchObject({
			baselineDir: '../_sp_',
			diffDir: '../_sp_/__diff_output__',
			resultDir: '../_sp_/__results__',
		})
})

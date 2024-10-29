import { type StoryContext, setProjectAnnotations } from '@storybook/react'
import { commands, page } from 'storybook-addon-vis'
import {
	configureSnapshotBeforeAll,
	configureSnapshotBeforeEach,
	shouldTakeSnapshot,
	toMatchImageSnapshot,
} from 'storybook-addon-vis/vitest-setup'
import { afterEach, beforeAll, beforeEach, expect } from 'vitest'
import * as projectAnnotations from './preview'

expect.extend({ toMatchImageSnapshot })

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations])

beforeAll(async (suite) => {
	project.beforeAll()
	const isCI = await commands.isCI()
	await configureSnapshotBeforeAll(suite, {
		snapshotPath: `__snapshots__/${getOSName()}${isCI ? '-ci' : ''}`,
	})
})

beforeEach((ctx) => {
	configureSnapshotBeforeEach(ctx)
})

afterEach<{ story?: StoryContext }>(async (ctx) => {
	if (!shouldTakeSnapshot(ctx)) return
	const r = await page.imageSnapshot()
	await expect(r).toMatchImageSnapshot()
})

function getOSName() {
	let OSName = 'unknown'
	if (navigator.userAgent.indexOf('Win') !== -1) OSName = 'win32'
	if (navigator.userAgent.indexOf('Mac') !== -1) OSName = 'darwin'
	if (navigator.userAgent.indexOf('Linux') !== -1) OSName = 'linux'
	if (navigator.userAgent.indexOf('Android') !== -1) OSName = 'android'
	if (navigator.userAgent.indexOf('like Mac') !== -1) OSName = 'ios'
	return OSName
}

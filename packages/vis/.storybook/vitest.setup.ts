import { type StoryContext, setProjectAnnotations } from '@storybook/react'
import { afterEach, beforeAll, expect } from 'vitest'
import { page, setupVitestVis, shouldTakeSnapshot, toMatchImageSnapshot } from '../src/vitest-setup.js'
import * as projectAnnotations from './preview'

expect.extend({ toMatchImageSnapshot })

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations])
const vis = setupVitestVis()

beforeAll(async (suite) => {
	project.beforeAll()
	await vis.beforeAll(suite)
})

afterEach<{ story?: StoryContext }>(async (ctx) => {
	if (!shouldTakeSnapshot(ctx)) return
	const r = await page.imageSnapshot()
	expect(r).toMatchImageSnapshot()
})

// import {it}from 'vitest'

import type { Preview } from '@storybook/react'
import { defineSnapshotParam, defineSnapshotProjectParam } from './param'

describe(`${defineSnapshotProjectParam.name}()`, () => {
	it.todo('can define the snapshot root folder relative to the root of the project', () => {
		const preview: Preview = {
			parameters: defineSnapshotProjectParam({
				snapshotPath: './_sp_',
			}),
		}
		expect(preview).toEqual({
			snapshotPath: './_sp_',
		})
	})

	it.todo('can define the baseline, result, and diff folders relative to the snapshot root folder', () => {
		const preview: Preview = {
			parameters: defineSnapshotProjectParam({
				baseline: 'baseline',
				result: 'result',
				diff: 'diff',
			}),
		}
		expect(preview).toEqual({
			baseline: 'baseline',
			result: 'result',
			diff: 'diff',
		})
	})
})

describe(`${defineSnapshotParam.name}()`, () => {
	it.todo('can define the comparison method for snapshots', () => {
		const p = defineSnapshotParam({ delay: 200 })
		expect(p).toEqual({ delay: 200 })
	})
})

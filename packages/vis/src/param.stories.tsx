import type { Meta, StoryObj } from '@storybook/react'
import { defineSnapshotParam } from './index.js'

export default {
	title: 'param',
	tags: ['snapshot'],
} satisfies Meta

export const MeetFailureThreshold: StoryObj = {
	parameters: defineSnapshotParam({
		failureThreshold: 70,
	}),
	render: () => <div data-testid="subject">unit test</div>,
	// render: () => <div data-testid="subject">unit text</div>,
}

export const MeetFailureThresholdByPercentage: StoryObj = {
	parameters: defineSnapshotParam({
		failureThreshold: 0.01,
		failureThresholdType: 'percent',
	}),
	render: () => <div data-testid="subject">unit test</div>,
	// render: () => <div data-testid="subject">unit text</div>,
}

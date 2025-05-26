import { AddonPanel, Placeholder, ScrollArea } from '@storybook/components'
import { memo } from 'react'
import { styled } from 'storybook/theming'
import { SNAPSHOT_ROOT_DIR } from 'vitest-plugin-vis/client-api'
import type { ImageSnapshotResults } from '../shared/events.ts'

interface PanelProps {
	active: boolean
	snapshotResults: ImageSnapshotResults[]
}

export const VisPanel = memo(function VisResultsPanel({ active, snapshotResults = [] }: PanelProps) {
	const groupedResults = snapshotResults.reduce(
		(acc, result) => {
			const suiteName = result.snapshotRootDir.slice(SNAPSHOT_ROOT_DIR.length + 1)
			const key = `(${suiteName}) ${result.fileName}`
			acc[key] = [...(acc[key] ?? []), result]
			return acc
		},
		{} as Record<string, ImageSnapshotResults[]>,
	)
	return (
		<AddonPanel active={active}>
			{snapshotResults.length > 0 ? (
				<ScrollArea vertical>
					{Object.entries(groupedResults).map(([key, results]) => (
						<div key={key}>
							{results.some((result) => result.type === 'diff') ? (
								<>
									<SnapshotRow failed>{key}</SnapshotRow>
									{results.map((result) => (
										<img key={result.filePath} src={`data:image/png;base64,${result.base64}`} alt={result.fileName} />
									))}
								</>
							) : (
								<>
									<SnapshotRow>{key}</SnapshotRow>
									<img
										key={results[0].filePath}
										src={`data:image/png;base64,${results[0].base64}`}
										alt={results[0].fileName}
									/>
								</>
							)}
						</div>
					))}
				</ScrollArea>
			) : (
				<Placeholder>There is no snapshots for this story</Placeholder>
			)}
		</AddonPanel>
	)
})

const SnapshotRow = styled.div<{ failed?: boolean }>(({ theme, failed }) => ({
	paddingBlock: '0.5rem',
	paddingInline: '0.2rem',
	backgroundColor: failed ? theme.background.negative : theme.background.positive,
	color: theme.barTextColor,
}))

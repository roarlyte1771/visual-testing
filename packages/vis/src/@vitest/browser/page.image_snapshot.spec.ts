import { basename } from 'pathe'
import { expect, it } from 'vitest'
import { page } from './context.js'
import { toSnapshotId } from './image_snapshot.logic.js'

it('save file under __results__', async ({ task }) => {
	const f1 = await page.imageSnapshot()
	const filename = basename(task.file.name)
	expect(f1.resultPath).toMatch(
		`../../../__snapshots__/${getOSName()}/__results__/${filename}/${toSnapshotId(task.name)}-1.png`,
	)

	const f2 = await page.imageSnapshot()
	expect(f2.resultPath).toMatch(
		`../../../__snapshots__/${getOSName()}/__results__/${filename}/${toSnapshotId(task.name)}-2.png`,
	)
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

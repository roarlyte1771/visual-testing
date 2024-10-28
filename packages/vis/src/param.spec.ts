import { defineSnapshotParam } from './param'

describe(`${defineSnapshotParam.name}()`, () => {
	it.todo('can define the comparison method for snapshots', () => {
		const p = defineSnapshotParam({ delay: 200 })
		expect(p).toEqual({ delay: 200 })
	})
})

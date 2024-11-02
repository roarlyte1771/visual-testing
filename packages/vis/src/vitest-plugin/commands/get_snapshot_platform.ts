import ci from 'is-ci'

export const getSnapshotPlatform = async () => {
	return ci ? process.platform : 'local'
}

import ci from 'is-ci'

export const getSnapshotPlatform = async () => {
	return `${process.platform}${ci ? '-ci' : ''}`
}

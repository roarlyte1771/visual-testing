import { expect } from '@storybook/test'
import { page } from './@vitest/browser/context.js'
import { imageSnapshot } from './@vitest/browser/page.image_snapshot.js'
import './augment.js'
import { toMatchImageSnapshot } from './expect.to_match_image_snapshot.js'

page.extend({ imageSnapshot })
expect.extend({ toMatchImageSnapshot })

export * from './@vitest/browser/context.js'
export * from './@vitest/browser/types.js'
export * from './param.js'

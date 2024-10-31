import { composeStories } from '@storybook/react'
import { render } from '@testing-library/react'
import { page } from 'storybook-addon-vis'
import { expect, it } from 'vitest'
import { Button } from './Button'
import * as rawStories from './Button.stories'

const stories = composeStories(rawStories)

it('take whole story snapshot', async () => {
	await stories.Primary.run()
	expect(page.imageSnapshot()).toMatchImageSnapshot()
})

test('DOM snapshot', async () => {
	const { getByTestId } = await render(<Button label="Button" data-testid="subject" />)
	const subject = getByTestId('subject')
	expect(subject).toMatchSnapshot()
})

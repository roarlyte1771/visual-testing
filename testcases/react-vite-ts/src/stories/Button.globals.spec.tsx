import { render } from '@testing-library/react'
import { page } from 'storybook-addon-vis'
import { Button } from './Button'

it('renders', async () => {
	const { getByText } = await render(<Button label="Button" />)
	const subject = getByText('Button')
	expect(subject).toBeInTheDocument()
	expect(page.imageSnapshot()).toMatchImageSnapshot()
})

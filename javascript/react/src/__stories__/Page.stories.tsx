/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/await-thenable */
import { userEvent, within } from '@storybook/testing-library'

import { Page } from './Page.js'

const storyMetadata = {
	title: 'Example/Page',
	component: Page,
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
}
export default storyMetadata

const Template = () => <Page />

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const LoggedOut = Template.bind({})

export const LoggedIn = Template.bind({}) as any
LoggedIn.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
	const canvas = within(canvasElement)
	const loginButton = await canvas.getByRole('button', { name: /Log in/i })
	await userEvent.click(loginButton)
}

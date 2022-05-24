/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { HeaderProps } from './Header.js'
import { Header } from './Header.js'

const storyMetadata = {
	title: 'Example/Header',
	component: Header,
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
}
export default storyMetadata

const Template = (args: HeaderProps) => <Header {...args} />

export const LoggedIn = Template.bind({}) as any as { args: HeaderProps }
LoggedIn.args = {
	user: {
		name: 'Jane Doe',
	},
}

export const LoggedOut = Template.bind({}) as any as { args: HeaderProps }
LoggedOut.args = {}

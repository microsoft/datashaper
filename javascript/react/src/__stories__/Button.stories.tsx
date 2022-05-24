/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ButtonProps } from './Button.js'
import { Button } from './Button.js'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const storyMetadata = {
	title: 'Example/Button',
	component: Button,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
}
export default storyMetadata

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: ButtonProps) => <Button {...args} />

export const Primary = Template.bind({}) as any as { args: ButtonProps }
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	primary: true,
	label: 'Button',
}

export const Secondary = Template.bind({}) as any as { args: ButtonProps }
Secondary.args = {
	label: 'Button',
}

export const Large = Template.bind({}) as any as { args: ButtonProps }
Large.args = {
	size: 'large',
	label: 'Button',
}

export const Small = Template.bind({}) as any as { args: ButtonProps }
Small.args = {
	size: 'small',
	label: 'Button',
}

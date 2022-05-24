/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailText } from './DetailText.js'
import type { DetailTextProps } from './DetailText.types.js'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const storyMetadata = {
	title: 'Components/DetailText',
	component: DetailText,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		text: {
			type: { name: 'string', required: true },
			defaultValue: 'This is some detail text',
			description: 'The detail text to show',
			control: { type: 'text' },
		},
	},
}
export default storyMetadata

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: DetailTextProps) => <DetailText {...args} />

export const Primary = Template.bind({}) as any as { args: DetailTextProps }

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	text: 'This is some detail text',
}

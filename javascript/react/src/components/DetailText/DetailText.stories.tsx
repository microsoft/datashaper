/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailText as DetailTextComponent } from './DetailText.js'
import type { DetailTextProps } from './DetailText.types.js'

const storyMetadata = {
	title: 'Components/DetailText',
	component: DetailTextComponent,
	argTypes: {
		text: {
			type: { name: 'string', required: true },
			description: 'The detail text to show',
			control: { type: 'text' },
		},
	},
}
export default storyMetadata

const Template = (args: DetailTextProps) => <DetailTextComponent {...args} />

export const DetailText = Template.bind({}) as any as { args: DetailTextProps }

DetailText.args = {
	text: 'This is some detail text',
}

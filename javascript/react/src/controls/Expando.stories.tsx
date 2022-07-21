/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ExpandoProps } from './Expando.js'
import { Expando } from './Expando.js'

const storyMetadata = {
	title: 'Controls/Expando',
	component: Expando,
}
export default storyMetadata

const Template = (args: ExpandoProps) => (
	<Expando {...args}>Here is the child content!</Expando>
)

export const Primary = Template.bind({}) as any as { args: ExpandoProps }

Primary.args = {
	label: 'More...',
	defaultExpanded: false,
}

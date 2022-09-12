/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ArqueroTableHeaderProps} from '@datashaper/react';
import {
	ArqueroTableHeader as ArqueroTableHeaderComponent
} from '@datashaper/react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
	title: 'ArqueroTableHeader',
	component: ArqueroTableHeaderComponent,
	argTypes: {},
} as ComponentMeta<typeof ArqueroTableHeaderComponent>

const Template: ComponentStory<typeof ArqueroTableHeaderComponent> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { stocks } }: any,
) => <ArqueroTableHeaderComponent {...args} table={stocks} />

export const ArqueroTableHeader = Template.bind({})

ArqueroTableHeader.args = {
	showColumnCount: true,
	showRowCount: true,
	name: 'stocks.csv',
	visibleColumns: ['Symbol', 'Close'],
	// storybook injects defaults wrappers, which messes with our falsy logic
	onRenameTable: undefined,
}

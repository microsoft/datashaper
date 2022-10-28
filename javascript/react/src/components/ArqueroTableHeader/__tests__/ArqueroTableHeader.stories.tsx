/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import { ArqueroTableHeader } from '../ArqueroTableHeader.js'
import type { ArqueroTableHeaderProps } from '../ArqueroTableHeader.types.js'
import { CommandBarsStory } from './CommandBars/CommandBars.story.js'
import { TableCommandsStory } from './TableCommands/TableCommands.story.js'

const meta = {
	title: 'Components/ArqueroTableHeader',
	component: ArqueroTableHeader,
	args: {
		showColumnCount: true,
		showRowCount: true,
		name: 'stocks.csv',
		visibleColumns: [
			'Symbol',
			'Date',
			'Close',
			'Volumne',
			'Open',
			'High',
			'Low',
		],
	},
}

export default meta

const Template: ComponentStory<typeof ArqueroTableHeader> = (
	args: ArqueroTableHeaderProps,
	{ loaded: { stocks } }: any,
) => <ArqueroTableHeader {...args} table={stocks} />

export const Basic = Template.bind({})
export const Customized = TableCommandsStory.bind({})
Customized.args = {
	color: 'cornflowerblue',
	background: 'antiquewhite',
	styles: {
		root: {
			height: 56,
			borderBottom: '1px solid cornflowerblue',
		},
	},
}
export const CommandBars = CommandBarsStory
export const TableCommands = TableCommandsStory

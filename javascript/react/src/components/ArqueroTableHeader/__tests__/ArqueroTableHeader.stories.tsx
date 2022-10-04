/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ArqueroTableHeader } from '../ArqueroTableHeader.js'
import { BasicStory } from './Basic.story.js'
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

export const Basic = BasicStory
export const CommandBars = CommandBarsStory
export const TableCommands = TableCommandsStory

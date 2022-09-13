/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ArqueroDetailsList } from '@datashaper/react'
import type { ComponentStory } from '@storybook/react'

import {
	ArqueroDetailsListProps,
	StatsColumnType,
} from '../ArqueroDetailsList.types.js'

const Template: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
) => <ArqueroDetailsList {...args} table={stocks} />

export const ParameterizedStory = Template.bind({})
ParameterizedStory.args = {
	isSortable: true,
	isHeadersFixed: false,
	isResizable: true,
	defaultSortColumn: 'Volume',
	compact: true,
	isStriped: false,
	isColumnClickable: true,
	showColumnBorders: true,
	includeAllColumns: true,
	features: {
		smartHeaders: false,
		statsColumnHeaders: true,
		histogramColumnHeaders: true,
		smartCells: true,
		showNumberMagnitude: false,
		showBooleanSymbol: false,
		showDateFormatted: false,
		showSparkbar: false,
		showSparkline: false,
		showCategoricalBar: false,
		showDropdown: false,
		statsColumnTypes: [
			StatsColumnType.Type,
			StatsColumnType.Min,
			StatsColumnType.Max,
			StatsColumnType.Distinct,
			StatsColumnType.Invalid,
		],
	},
	offset: 0,
	limit: 1000,
	selectedColumn: 'Volume',
	visibleColumns: [
		'Symbol',
		'Date',
		'Close',
		'Volume',
		'Open',
		'High',
		'Low',
		'Week',
		'Month',
	],
}

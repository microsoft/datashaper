/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ArqueroDetailsList } from '@datashaper/react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import { ArqueroDetailsListProps, StatsColumnType } from '../types.js'

export default {
	title: '@essex:arquero-react/ArqueroDetailsList',

	component: ArqueroDetailsList,
	argTypes: {},
} as ComponentMeta<typeof ArqueroDetailsList>

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
	limit: Infinity,
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

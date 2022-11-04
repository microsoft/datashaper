/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import { BasicStory } from './Basic.story.js'
import { ColumnsStory } from './Columns/Columns.story.js'
import { FeaturesStory } from './Features.story.js'
import { FillStory } from './Fill.story.js'
import { MicroStory } from './Micro.story.js'
import { PerformanceStory } from './Performance/Performance.story.js'
import { RowGroupingStory } from './RowGrouping/RowGrouping.story.js'
import { SelectionStory } from './Selection.story.js'

const meta = {
	title: 'Components/ArqueroDetailsList',
	component: ArqueroDetailsList,
	args: {
		style: {
			border: '1px solid orange',
		},
	},
}

export default meta

export const Basic = BasicStory
export const Features = FeaturesStory
export const Fill = FillStory
export const Micro = MicroStory
Micro.storyName = 'Micro mode'
export const Columns = ColumnsStory
export const Selection = SelectionStory
Selection.storyName = 'Selection & sorting'
export const RowGrouping = RowGroupingStory
export const Performance = PerformanceStory

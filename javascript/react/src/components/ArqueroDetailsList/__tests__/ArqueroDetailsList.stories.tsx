/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import { BasicStory } from './Basic.story.js'
import { ColumnsStory } from './Columns/Columns.story.js'
import { FeaturesStory } from './Features.story.js'
import { PerformanceStory } from './Performance/Performance.story.js'
import { RowGroupingStory } from './RowGrouping/RowGrouping.story.js'

const meta = {
	title: 'ArqueroDetailsList',
	component: ArqueroDetailsList,
}

export default meta

export const Basic = BasicStory
export const Features = FeaturesStory
export const Columns = ColumnsStory
export const RowGrouping = RowGroupingStory
export const Performance = PerformanceStory

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BasicStory } from './Basic.story.js'
import { ParameterizedStory } from './Parameterized.story.js'
import { PerformanceStory } from './Performance/Performance.story.js'
import { RowGroupingStory } from './RowGrouping/RowGrouping.story.js'

const meta = {
	title: 'ArqueroDetailsList',
}

export default meta

export const Basic = BasicStory
export const RowGrouping = RowGroupingStory

export const Performance = PerformanceStory
Performance.storyName = 'Performance Test (slow!)'

export const Parameterized = ParameterizedStory

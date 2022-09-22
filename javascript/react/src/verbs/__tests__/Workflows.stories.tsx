/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'

import aggregatedLookup from './specs/aggregated-lookup.json'
import binning from './specs/binning.json'
import categorical from './specs/categorical.json'
import dropdown from './specs/dropdown.json'
import everyOperation from './specs/every-operation.json'
import multistepBinarize from './specs/multistep-binarize.json'
import onehotunhot from './specs/onehot-unhot.json'
import sparkbar from './specs/sparkbar.json'
import sparkline from './specs/sparkline.json'
import spreadhot from './specs/spreadhot.json'
import { WorkflowExampleStory } from './WorkflowExample/WorkflowExample.story.js'

const storyMetadata = {
	title: 'Workflows/Examples',
}
export default storyMetadata

export const EveryOperation = WorkflowExampleStory.bind({})
EveryOperation.args = {
	schema: everyOperation as WorkflowSchema,
}

export const AggregatedLookup = WorkflowExampleStory.bind({})
AggregatedLookup.args = {
	schema: aggregatedLookup as WorkflowSchema,
}

export const Binning = WorkflowExampleStory.bind({})
Binning.args = {
	schema: binning as WorkflowSchema,
}

export const DropdownCells = WorkflowExampleStory.bind({})
DropdownCells.args = {
	schema: dropdown as WorkflowSchema,
}

export const MultistepBinarize = WorkflowExampleStory.bind({})
MultistepBinarize.args = {
	schema: multistepBinarize as WorkflowSchema,
}

export const OnehotUnhot = WorkflowExampleStory.bind({})
OnehotUnhot.args = {
	schema: onehotunhot as WorkflowSchema,
}
OnehotUnhot.storyName = 'Onehot/Unhot'

export const Sparkbar = WorkflowExampleStory.bind({})
Sparkbar.args = {
	schema: sparkbar as WorkflowSchema,
}

export const SparkbarCategorical = WorkflowExampleStory.bind({})
SparkbarCategorical.args = {
	schema: categorical as WorkflowSchema,
}
SparkbarCategorical.storyName = 'Sparkbar: Categorical'

export const Sparkline = WorkflowExampleStory.bind({})
Sparkline.args = {
	schema: sparkline as WorkflowSchema,
}

export const Spreadhot = WorkflowExampleStory.bind({})
Spreadhot.args = {
	schema: spreadhot as WorkflowSchema,
}

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
import multiStepBinarize from './specs/multi-step-binarize.json'
import onehotUnhot from './specs/onehot-unhot.json'
import sparkbar from './specs/sparkbar.json'
import sparkline from './specs/sparkline.json'
import spreadHot from './specs/spread-onehot.json'
import { WorkflowExampleStory } from './WorkflowExample/WorkflowExample.story.js'

const storyMetadata = {
	title: 'Workflows/Examples',
}
export default storyMetadata

export const EveryOperation = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: everyOperation as WorkflowSchema,
	},
}

export const AggregatedLookup = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: aggregatedLookup as WorkflowSchema,
	},
}

export const Binning = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: binning as WorkflowSchema,
	},
}

export const DropdownCells = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: dropdown as WorkflowSchema,
	},
}

export const MultiStepBinarize = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: multiStepBinarize as WorkflowSchema,
	},
}

export const OnehotUnhot = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: onehotUnhot as WorkflowSchema,
	},

	name: 'Onehot/Unhot',
}

export const Sparkbar = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: sparkbar as WorkflowSchema,
	},
}

export const SparkbarCategorical = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: categorical as WorkflowSchema,
	},

	name: 'Sparkbar: Categorical',
}

export const Sparkline = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: sparkline as WorkflowSchema,
	},
}

export const SpreadHot = {
	render: WorkflowExampleStory.bind({}),

	args: {
		schema: spreadHot as WorkflowSchema,
	},
}

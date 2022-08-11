/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { PerformanceTestStory } from './PerformanceTestStory/PerformanceTestStory.js'
import { RowGroupingTestStory } from './RowGroupingTestStory/RowGroupingTestStory.js'

const meta = {
	title: '@essex:arquero-react/ArqueroDetailsList',
}

export default meta

export const PerformanceStory = (args, { loaded: { stocks } }: any) => {
	if (!stocks) {
		return <div>Loading...</div>
	}

	return <PerformanceTestStory mockTablePerformance={stocks} />
}

PerformanceStory.story = {
	name: 'Performance',
}

export const RowGroupingStory = (args, { loaded: { stocks } }: any) => {
	if (!stocks) {
		return <div>Loading</div>
	}

	return <RowGroupingTestStory mockTable={stocks} />
}

RowGroupingStory.story = {
	name: 'Row grouping',
}

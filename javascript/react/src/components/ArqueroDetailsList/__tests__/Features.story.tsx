/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'
import { StatsColumnType } from '../ArqueroDetailsList.types.js'

const Template: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => <ArqueroDetailsList {...args} table={stocks} />

export const FeaturesStory = Template.bind({})
FeaturesStory.args = {
	features: {
		histogramColumnHeaders: true,
		statsColumnHeaders: true,
		showBooleanSymbol: true,
		showNumberMagnitude: true,
		showCategoricalBar: true,
		showDateFormatted: true,
		showSparkbar: true,
		showSparkline: true,
		showDropdown: true,
		statsColumnTypes: [
			StatsColumnType.Type,
			StatsColumnType.Min,
			StatsColumnType.Max,
			StatsColumnType.Distinct,
			StatsColumnType.Invalid,
		],
	},
}

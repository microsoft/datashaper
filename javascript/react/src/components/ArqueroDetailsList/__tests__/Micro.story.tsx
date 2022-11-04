/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'
import { useMemo } from 'react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'

export const Template: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => {
	const metadata = useMemo(() => introspect(stocks, true), [stocks])
	return (
		<div
			style={{
				width: 1000,
				height: 600,
			}}
		>
			<ArqueroDetailsList {...args} table={stocks} metadata={metadata} />
		</div>
	)
}

export const MicroStory = Template.bind({})
MicroStory.args = {
	showColumnBorders: true,
	compact: true,
	// this is the smallest we can go without overriding other heights (like font size and bar charts)
	compactRowHeight: 16,
	striped: true,
	features: {
		statsColumnHeaders: true,
		smartCells: true,
		histogramColumnHeaders: true,
	},
}

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
	{ loaded: { companies2 } }: any,
): JSX.Element => {
	const metadata = useMemo(() => introspect(companies2, true), [companies2])
	return (
		<div
			style={{
				width: 1000,
				height: 600,
				border: '1px solid orange',
			}}
		>
			<ArqueroDetailsList {...args} table={companies2} metadata={metadata} />
		</div>
	)
}

export const FillStory = Template.bind({})
FillStory.args = {
	showColumnBorders: true,
	compact: true,
	striped: true,
	fill: true,
	features: { statsColumnHeaders: true, smartCells: true },
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'
import { useMemo, useState } from 'react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'
import { StatsColumnType } from '../ArqueroDetailsList.types.js'

export const SelectionStory: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => {
	const [selected, setSelected] = useState<string | undefined>()
	const metadata = useMemo(() => introspect(stocks, false), [stocks])
	return (
		<ArqueroDetailsList
			{...args}
			table={stocks}
			metadata={metadata}
			features={{
				statsColumnHeaders: true,
				statsColumnTypes: [StatsColumnType.Type],
			}}
			showColumnBorders
			selectedColumn={selected}
			onColumnClick={(_e, c) => setSelected(c?.name)}
		/>
	)
}

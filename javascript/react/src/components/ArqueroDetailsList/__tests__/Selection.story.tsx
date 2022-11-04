/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect } from '@datashaper/tables'
import type { IColumn } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import { useCallback, useMemo, useState } from 'react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'
import { StatsColumnType } from '../ArqueroDetailsList.types.js'

export const SelectionStory: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => {
	const [selected, setSelected] = useState<string | undefined>()
	const metadata = useMemo(() => introspect(stocks, true), [stocks])
	const handleSelect = useCallback(
		(_e?: any, c?: IColumn) =>
			setSelected(prev => (c?.key === prev ? undefined : c?.key)),
		[setSelected],
	)
	return (
		<ArqueroDetailsList
			features={{
				statsColumnHeaders: true,
				statsColumnTypes: [StatsColumnType.Type],
				histogramColumnHeaders: true,
			}}
			showColumnBorders
			sortable
			defaultSortColumn="Date"
			{...args}
			table={stocks}
			metadata={metadata}
			selectedColumn={selected}
			onColumnSelect={handleSelect}
		/>
	)
}

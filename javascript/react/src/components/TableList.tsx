/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { DetailText } from './internal/DetailText.js'
import { TableCard } from './internal/TableCard.js'
import { useIsTableSelected } from './TableList.hooks.js'
import type { TableListProps } from './TableList.types.js'
import { ListContainer } from './TableList.styles.js'

export const TableList: React.FC<TableListProps> = memo(function TablesList({
	tables,
	onSelect,
	selected,
}) {
	const isSelected = useIsTableSelected(selected)

	return (
		<ListContainer>
			{tables.map((table, index) => {
				return (
					<TableCard
						tableName={table.id}
						key={table.id ?? index}
						isSelected={isSelected}
						onSelect={onSelect}
					/>
				)
			})}
			{!tables.length && <DetailText text="Input tables will show here" />}
		</ListContainer>
	)
})

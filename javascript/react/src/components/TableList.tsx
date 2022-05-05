/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { DetailText } from './DetailText.jsx'
import { TableCard } from './TableCard.jsx'
import { useIsTableSelected } from './TableList.hooks.js'
import type { TableListProps } from './TableList.types.js'
import { ListContainer } from './TableListBar.styles.js'

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
						tableName={table.name || table.id}
						index={index}
						key={index}
						isSelected={isSelected}
						onSelect={onSelect}
					/>
				)
			})}
			{!tables.length && <DetailText text="Input tables will show here" />}
		</ListContainer>
	)
})

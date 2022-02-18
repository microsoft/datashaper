/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@data-wrangling-components/utilities'
import { memo } from 'react'
import styled from 'styled-components'
import { DetailText } from '../DetailText/index.js'
import { TableCard } from './TableCard.js'
import { useIsTableSelected } from './hooks'

export const TablesList: React.FC<{
	tables: BaseFile[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ tables, onSelect, selected }) {
	const isSelected = useIsTableSelected(selected)

	return (
		<ListContainer>
			{tables.map((table, index) => {
				return (
					<TableCard
						table={table}
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

const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	width: 100%;
	row-gap: 6px;
`

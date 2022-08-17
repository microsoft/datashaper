/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect } from '@datashaper/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type { TableMetadata } from '@datashaper/schema'
import { Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useEffect, useState } from 'react'

import { Table } from '../SharedStyles.styles.js'
import { useToggleTableFeatures } from './RowGroupingTestStory.hooks.js'
import {
	ButtonContainer,
	GroupByToggle,
} from './RowGroupingTestStory.styles.js'

export interface RowGroupingTestStoryProps {
	mockTable: ColumnTable | undefined
}

export const RowGroupingTestStory: React.FC<RowGroupingTestStoryProps> = memo(
	function RowGroupingTestStory({ mockTable }) {
		const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
		const [groupedMetadata, setGroupedMetadata] = useState<
			TableMetadata | undefined
		>()

		const [groupByList, setGroupByList] = useState<string[]>([])

		useEffect(() => {
			if (mockTable !== undefined) {
				let mockTableCopy = mockTable

				if (groupByList.length > 0)
					mockTableCopy = mockTableCopy.groupby(groupByList)

				setGroupedTable(mockTableCopy)
				setGroupedMetadata(introspect(mockTableCopy, true))
			}
		}, [mockTable, groupByList])

		const { tableFeatures } = useToggleTableFeatures()

		const _onChangeSymbol = useCallback(
			(ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
				if (checked) {
					setGroupByList([...groupByList, 'Symbol'])
				} else {
					const listCopy = groupByList.filter(e => e !== 'Symbol')
					setGroupByList(listCopy)
				}
			},
			[setGroupByList, groupByList],
		)

		const _onChangeMonth = useCallback(
			(ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
				if (checked) {
					setGroupByList([...groupByList, 'Month'])
				} else {
					const listCopy = groupByList.filter(e => e !== 'Month')
					setGroupByList(listCopy)
				}
			},
			[setGroupByList, groupByList],
		)

		if (!groupedTable || !groupedMetadata) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<Label>Group by: </Label>
				<ButtonContainer>
					<GroupByToggle
						label="Symbol"
						onText="On"
						offText="Off"
						onChange={_onChangeSymbol}
					/>
					<GroupByToggle
						label="Month"
						onText="On"
						offText="Off"
						onChange={_onChangeMonth}
					/>
				</ButtonContainer>

				<ArqueroTableHeader table={groupedTable} />
				<ArqueroDetailsList
					isSortable
					compact
					showColumnBorders
					isHeadersFixed
					table={groupedTable}
					metadata={groupedMetadata}
					features={{
						...tableFeatures,
						smartCells: true,
						smartHeaders: true,
					}}
				/>
			</Table>
		)
	},
)

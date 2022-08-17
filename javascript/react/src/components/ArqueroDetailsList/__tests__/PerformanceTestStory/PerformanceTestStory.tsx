/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect } from '@datashaper/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type { TableMetadata } from '@datashaper/schema'
import type { IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useEffect, useMemo, useState } from 'react'

import { Table } from '../SharedStyles.styles.js'
import { useColumnCommands } from './PerformanceTestStory.hooks.js'

export interface PerformanceTestStoryProps {
	mockTablePerformance: ColumnTable | undefined
}

export const PerformanceTestStory: React.FC<PerformanceTestStoryProps> = memo(
	function PerformanceTestStory({ mockTablePerformance }) {
		const [table, setTable] = useState<ColumnTable | undefined>()
		const [metadata, setMetadata] = useState<TableMetadata | undefined>()

		useEffect(() => {
			if (mockTablePerformance !== undefined) {
				let mockTablePerformanceCopy = mockTablePerformance
				mockTablePerformanceCopy.ungroup()
				// make sure we have a large enough number of rows to impact rendering perf
				for (let i = 0; i < 10; i++) {
					mockTablePerformanceCopy = mockTablePerformanceCopy.concat(
						mockTablePerformanceCopy,
					)
				}

				setTable(mockTablePerformanceCopy)
				setMetadata(introspect(mockTablePerformanceCopy, true))
			}
		}, [mockTablePerformance])

		const columnCommands = useColumnCommands()

		const columns = useMemo((): IColumn[] | undefined => {
			if (table === undefined) return undefined
			return table.columnNames().map(x => {
				return {
					name: x,
					key: x,
					fieldName: x,
					minWidth: 180,
				} as IColumn
			})
		}, [table])

		if (!table || !metadata) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<ArqueroTableHeader table={table} name={'table1'} />

				<ArqueroDetailsList
					table={table}
					metadata={metadata}
					features={{
						smartCells: true,
						smartHeaders: true,
						commandBar: [columnCommands],
					}}
					columns={columns}
					isSortable
					isHeadersFixed
					isStriped
					showColumnBorders
				/>
			</Table>
		)
	},
)

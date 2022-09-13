/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'

import { Table } from '../ArqueroDetailsList.styles.js'
import { useBigTable, useColumnConfig } from './Performance.hooks.js'

export interface PerformanceProps {
	table: ColumnTable | undefined
}

export const Performance: React.FC<PerformanceProps> = memo(
	function Performance({ table }) {
		const { local, metadata } = useBigTable(table)

		const columns = useColumnConfig(local)

		if (!local || !metadata) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<ArqueroTableHeader table={local} name={'table1'} />
				<ArqueroDetailsList
					table={local}
					metadata={metadata}
					features={{
						smartCells: true,
						smartHeaders: true,
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

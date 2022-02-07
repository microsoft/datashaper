/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { ArqueroDetailsList, ArqueroTableHeader } from '../../'
import ColumnTable from 'arquero/dist/types/table/column-table'

export const OutputTable: React.FC<{
	table?: ColumnTable
}> = memo(function OutputTable({ table }) {
	return (
		<>
			{table ? (
				<TableContainer>
					<ArqueroTableHeader visibleRows={1} table={table} />
					<ArqueroDetailsList
						compact
						showColumnBorders
						styles={{ root: { maxHeight: '39vh' } }}
						isHeadersFixed
						table={table}
					/>
				</TableContainer>
			) : null}
		</>
	)
})

const TableContainer = styled.div`
	max-height: inherit;
`

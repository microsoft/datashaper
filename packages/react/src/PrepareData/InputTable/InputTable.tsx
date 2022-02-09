/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { introspect, TableContainer } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useMemo } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { ArqueroDetailsList, ArqueroTableHeader, StatsColumnType } from '../../'

const statsColumnTypes = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const InputTable: React.FC<{
	table?: TableContainer
}> = memo(function InputTable({ table }) {
	const metadata = useMemo((): any => {
		return table && introspect(table?.table as ColumnTable, true)
	}, [table])

	return (
		<If condition={!!table}>
			<Then>
				<Container>
					<ArqueroTableHeader
						visibleRows={1}
						name={table?.name}
						table={table?.table as ColumnTable}
					/>
					<ArqueroDetailsList
						compact
						showColumnBorders
						metadata={metadata}
						styles={{ root: { maxHeight: '24vh' } }}
						isHeadersFixed
						features={{
							smartHeaders: true,
							statsColumnTypes: statsColumnTypes,
						}}
						table={table?.table?.sample(1) as ColumnTable}
					/>
				</Container>
			</Then>
			<Else>
				<Then>
					<PreviewText>Select a table to preview here</PreviewText>
				</Then>
			</Else>
		</If>
	)
})

const Container = styled.div`
	max-height: inherit;
	max-width: 77vw;
`

const PreviewText = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.application().border().hex()};
`

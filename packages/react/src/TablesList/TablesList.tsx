/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useMemo, useState } from 'react'
import { TableFile } from '../types'
import styled from 'styled-components'
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react'
import { ArqueroDetailsList, ArqueroTableHeader, StatsColumnType } from '../'
import { Else, If, Then } from 'react-if'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { introspect, TableMetadata } from '@data-wrangling-components/core'

const statsColumnTypes = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const TablesList: React.FC<{ files: Map<string, ColumnTable> }> = memo(
	function TablesList({ files }) {
		const [selectedTable, setSelectedTable] = useState<TableFile>()
		const [metadata, setMetadata] = useState<TableMetadata>()

		const list = useMemo((): TableFile[] => {
			return Array.from(files).map(([key, table]) => {
				return {
					name: key,
					table,
				} as TableFile
			})
		}, [files])

		const selectTable = useCallback(
			(name: any) => {
				const table = list.find(x => x.name === name)
				setSelectedTable(table)
				const newMetadata = introspect(table?.table as ColumnTable, true)
				setMetadata(newMetadata)
			},
			[list, setSelectedTable, setMetadata],
		)

		const columns = useMemo(() => {
			return [
				{
					name: 'name',
					fieldName: 'name',
					key: 'name',
				},
			] as IColumn[]
		}, [])

		return (
			<Container>
				<ListContainer>
					<DetailsList
						isHeaderVisible={false}
						items={list}
						columns={columns}
						selectionMode={SelectionMode.none}
						onRenderRow={(props, re) =>
							re ? (
								<TableSelect onClick={() => selectTable(props?.item.name)}>
									{re(props)}
								</TableSelect>
							) : null
						}
					/>
				</ListContainer>
				<If condition={!!selectedTable}>
					<Then>
						<TableContainer>
							<ArqueroTableHeader
								visibleRows={1}
								name={selectedTable?.name}
								table={selectedTable?.table as ColumnTable}
							/>
							<ArqueroDetailsList
								compact
								metadata={metadata}
								styles={{ root: { maxHeight: '24vh' } }}
								isHeadersFixed
								features={{
									smartHeaders: true,
									statsColumnTypes: statsColumnTypes,
								}}
								table={selectedTable?.table.sample(1) as ColumnTable}
							/>
						</TableContainer>
					</Then>
					<Else>
						<Then>
							<span>Preview your table here</span>
						</Then>
					</Else>
				</If>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	max-height: inherit;
	overflow: hidden;
`

const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	max-width: 20vw;
`

const TableContainer = styled.div`
	max-height: inherit;
	max-width: 77vw;
`

const TableSelect = styled.div`
	cursor: pointer;
`

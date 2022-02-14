/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { ColumnConfig, ColumnConfigMap } from './types'

export interface ArqueroTableProps {
	table: ColumnTable
	limit?: number
	skip?: number
	columnConfig?: ColumnConfigMap
}

const defaultConfig = {
	width: 100,
}

/**
 * Renders an arquero table manually so we can inject custom features.
 */
export const ArqueroTable: React.FC<ArqueroTableProps> = memo(
	function ArqueroTable({ table, limit = 100, skip = 0, columnConfig = {} }) {
		const theme = useThematic()

		const columns = useMemo(() => {
			return table.columnNames()
		}, [table])

		const indices = useMemo(() => {
			return table.indices(true)
		}, [table])

		// TODO: this isn't actually computing from the configuration
		const totalWidth = useMemo(() => {
			if (columnConfig) {
				return table.columnNames().reduce((acc, cur) => {
					const conf = columnConfig[cur] || defaultConfig
					const width = conf.width || 100
					return acc + width
				}, 0)
			}
			return table.numCols() * defaultConfig.width
		}, [table, columnConfig])

		const thead = useMemo(() => {
			return (
				<Thead theme={theme}>
					<tr>
						{columns.map(name => (
							<Th key={name} config={columnConfig[name] || defaultConfig}>
								{name}
							</Th>
						))}
					</tr>
				</Thead>
			)
		}, [columns, theme, columnConfig])

		const tbody = useMemo(() => {
			// eslint-disable-next-line
			const rows: any[] = []
			let count = 0
			let skipCount = 0
			const numRows = table.numRows()

			if (numRows > 0) {
				for (const currentIndex of indices) {
					if (skip < numRows) {
						skipCount++
						if (skipCount <= skip) {
							continue
						}
					}
					count++
					if (count > limit) {
						break
					}
					rows.push(
						<TbodyTr key={Math.random()}>
							{columns.map(colName => (
								<Td
									key={colName}
									config={columnConfig[colName] || defaultConfig}
								>
									{`${table.get(colName, currentIndex)}`}
								</Td>
							))}
						</TbodyTr>,
					)
				}
			}

			return <Tbody>{rows}</Tbody>
		}, [table, columns, limit, skip, indices, columnConfig])

		if (table.numRows() === 0) {
			return <></>
		}

		return (
			<Table theme={theme} width={totalWidth}>
				{thead}
				{tbody}
			</Table>
		)
	},
)

const sharedStyles = css`
	display: table;
	table-layout: fixed;
`

const Th = styled.th<{ config: ColumnConfig }>`
	width: ${({ config }) => config?.width || null}px;
	max-width: ${({ config }) => config?.width || null}px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Td = styled.td<{ config: ColumnConfig }>`
	width: ${({ config }) => config?.width || null}px;
	max-width: ${({ config }) => config?.width || null}px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Tbody = styled.tbody`
	display: block;
	box-sizing: border-box;
	border: 0;
	overflow: auto;
	overflow-x: hidden;
	&::-webkit-scrollbar {
		display: none;
	}
`

const Thead = styled.thead<{ theme: Theme }>`
	${sharedStyles}
	text-align: left;
	border: 0;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
	box-sizing: border-box;
	height: 30px;
`

const TbodyTr = styled.tr`
	${sharedStyles}
	box-sizing: border-box;
	border: 0;
	&:nth-child(odd) {
		background: var(--zebra);
	}
`

const Table = styled.table<{ theme: Theme; width: number }>`
	height: 100%;
	// this forces the layout to accept the column widths
	width: ${({ width }) => width}px;
	table-layout: fixed;
	box-sizing: border-box;
	--zebra: ${p => p.theme.application().faint().hex()};
`

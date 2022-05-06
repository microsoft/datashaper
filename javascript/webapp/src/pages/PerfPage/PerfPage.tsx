/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createLazyLoadingGroupHeader } from '@data-wrangling-components/react'
import type { ColumnMetadata, TableMetadata } from '@essex/arquero'
import { introspect } from '@essex/arquero'
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import type { IColumn, IDetailsGroupDividerProps } from '@fluentui/react'
import { Pivot, PivotItem } from '@fluentui/react'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useColumnCommands, useCommandBar } from './PerfPage.hooks.js'
import { Container, Table } from './PerfPage.styles.js'

/**
 * This is just a rudimentary page to load a large table for profiling the ArqueroDetailsList rendering.
 */
export const PerfPage: React.FC = memo(function PerfMage() {
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [tableName, setTableName] = useState('Table1')
	const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
	const [groupedMetadata, setGroupedMetadata] = useState<
		TableMetadata | undefined
	>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()

	useEffect(() => {
		const f = async () => {
			let root = await loadCSV('data/stocks.csv', {
				autoMax: 1000000,
			})
			const grouped = root.groupby(['Symbol', 'Month'])
			const groupedMeta = introspect(root, true)
			setGroupedTable(grouped)
			setGroupedMetadata(groupedMeta)
			root.ungroup()
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 10; i++) {
				root = root.concat(root)
			}
			console.time('root meta')
			const meta = introspect(root, true)
			console.timeEnd('root meta')
			setTable(root)
			setMetadata(meta)
		}
		f()
	}, [])

	const commandBar = useCommandBar(table, metadata, setTable, setMetadata)
	const columnCommands = useColumnCommands()

	const customGroupHeader = useCallback(
		(
			meta?: ColumnMetadata,
			columnName?: string,
			props?: IDetailsGroupDividerProps | undefined,
		) => {
			const custom = <h3>{meta?.name}</h3>
			return createLazyLoadingGroupHeader(props, custom, columnName, meta)
		},
		[],
	)

	const columns = useMemo((): IColumn[] | undefined => {
		if (!table) return undefined
		return table.columnNames().map(x => {
			return {
				name: x,
				key: x,
				fieldName: x,
				minWidth: 180,
			} as IColumn
		})
	}, [table])

	if (!table || !metadata || !groupedTable || !groupedMetadata) {
		return null
	}

	return (
		<Container>
			<Pivot>
				<PivotItem style={{ width: '96vw' }} key={'table'} headerText={'table'}>
					<Table>
						<ArqueroTableHeader
							table={table}
							name={tableName}
							commandBar={commandBar}
							onRenameTable={name => setTableName(name)}
						/>
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
				</PivotItem>
				<PivotItem key={'empty'} headerText={'empty'} />
				<PivotItem key={'grouped'} headerText={'grouped'}>
					<Table>
						<ArqueroTableHeader table={groupedTable} />
						<ArqueroDetailsList
							table={groupedTable}
							metadata={groupedMetadata}
							features={{
								smartCells: true,
								smartHeaders: true,
							}}
							onRenderGroupHeader={customGroupHeader}
							isSortable
						/>
					</Table>
				</PivotItem>
			</Pivot>
		</Container>
	)
})

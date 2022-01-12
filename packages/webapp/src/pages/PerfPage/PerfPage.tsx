/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	TableMetadata,
	introspect,
	ColumnMetadata,
} from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import { createLazyLoadingGroupHeader } from '@data-wrangling-components/react/src/ArqueroDetailsList/renderers'
import { IDetailsGroupDividerProps, Pivot, PivotItem } from '@fluentui/react'
import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
/**
 * This is just a rudimentary page to load a large table for profiling the ArqueroDetailsList rendering.
 */
export const PerfPage: React.FC = memo(function PerfMage() {
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
	const [groupedMetadata, setGroupedMetadata] = useState<
		TableMetadata | undefined
	>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()
	useEffect(() => {
		const f = async () => {
			let root = await loadCSV('data/stocks.csv', {})
			root = root.groupby(['Symbol', 'Month'])
			let meta = introspect(root, true)
			setGroupedTable(root)
			setGroupedMetadata(meta)
			root.ungroup()
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 6; i++) {
				root = root.concat(root)
			}
			meta = introspect(root, true)
			setTable(root)
			setMetadata(meta)
		}
		f()
	}, [])

	const customGroupHeader = useCallback(
		(meta?: ColumnMetadata, props?: IDetailsGroupDividerProps | undefined) => {
			const custom = <h3>{meta?.name}</h3>

			return createLazyLoadingGroupHeader(props, meta, custom)
		},
		[],
	)

	if (!table || !metadata || !groupedTable || !groupedMetadata) {
		return null
	}

	return (
		<Container>
			<p>
				Use the tabs to flip between a large table and an empty tab to profile
				re-mounting the table.
			</p>
			<Pivot>
				<PivotItem key={'table'} headerText={'table'}>
					<Table>
						<ArqueroTableHeader table={table} allowDownload />
						<ArqueroDetailsList
							table={table}
							metadata={metadata}
							features={{
								smartCells: true,
								smartHeaders: true,
							}}
						/>
					</Table>
				</PivotItem>
				<PivotItem key={'empty'} headerText={'empty'} />
				<PivotItem key={'grouped'} headerText={'grouped'}>
					<Table>
						<ArqueroTableHeader table={groupedTable} allowDownload />
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

const Container = styled.div``

const Table = styled.div`
	margin-top: 12px;
	width: 800ox;
	height: 600px;
`

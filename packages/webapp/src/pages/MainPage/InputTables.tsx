/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnConfigMap } from '@data-wrangling-components/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo } from 'react'
import styled from 'styled-components'
import { Table } from './Table'

export interface InputTablesProps {
	tables: Map<string, ColumnTable>
	config: ColumnConfigMap
	autoRender?: boolean
	compact?: boolean
}

export const InputTables: React.FC<InputTablesProps> = memo(
	function InputTables({ tables, config, autoRender, compact }) {
		return (
			<TablesContainer>
				{Array.from(tables).map(([key, table]) => (
					<Table
						key={`table-${key}`}
						name={key}
						table={table}
						config={config}
						autoRender={autoRender}
						compact={compact}
					/>
				))}
			</TablesContainer>
		)
	},
)

const TablesContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	width: 100%;
	justify-content: space-between;
`

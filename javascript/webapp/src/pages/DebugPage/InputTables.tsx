/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import type { DetailsListFeatures } from '@data-wrangling-components/react-arquero'
import { memo } from 'react'
import styled from 'styled-components'

import type { ColumnConfigMap } from './Table'
import { Table } from './Table'

export interface InputTablesProps {
	tables: Map<string, TableContainer>
	config: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
}

export const InputTables: React.FC<InputTablesProps> = memo(
	function InputTables({ tables, config, features, compact }) {
		return (
			<TablesContainer>
				{Array.from(tables).map(([key, container]) => (
					<Table
						key={`table-${key}`}
						name={key}
						table={container.table!}
						config={config}
						features={features}
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { DetailsListFeatures } from '@essex/arquero-react'
import { memo } from 'react'
import styled from 'styled-components'

import type { ColumnConfigMap } from './Table'
import { Table } from './Table'

export interface InputTablesProps {
	tables: TableContainer[]
	config: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
}

export const InputTables: React.FC<InputTablesProps> = memo(
	function InputTables({ tables, config, features, compact }) {
		return (
			<TablesContainer>
				{tables.map(container => (
					<Table
						key={`table-${container.id}`}
						name={container.id}
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

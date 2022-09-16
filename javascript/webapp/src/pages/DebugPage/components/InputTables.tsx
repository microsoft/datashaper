/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { TablesContainer } from './InputTables.styles.js'
import type { InputTablesProps } from './InputTables.types.js'
import { Table } from './Table.js'

export const InputTables: React.FC<InputTablesProps> = memo(
	function InputTables({ tables, config, features, compact }) {
		return (
			<TablesContainer>
				{tables.map(container => (
					<Table
						key={`table-${container.id}`}
						name={container.id}
						table={container.table!}
						metadata={container.metadata}
						config={config}
						features={features}
						compact={compact}
					/>
				))}
			</TablesContainer>
		)
	},
)

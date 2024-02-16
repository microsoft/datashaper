/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { Table } from '../ArqueroDetailsListStories.styles.js'
import {
	useCheckboxConfigs,
	useColumns,
	useSelectedColumn,
} from './Columns.hooks.js'

export const Columns: React.FC<ArqueroDetailsListProps> = memo(
	function Columns({ table, ...args }) {
		const { selected, onSelect } = useSelectedColumn()
		const { checkboxes } = useCheckboxConfigs(table)

		const { columns } = useColumns(checkboxes)

		if (!table) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<FullColumnList>
					{checkboxes?.map((config) => (
						<Checkbox key={`checkbox-${config.label}`} {...config} />
					))}
				</FullColumnList>
				<ArqueroDetailsList
					{...args}
					table={table}
					columns={columns}
					selectedColumn={selected}
					onColumnSelect={onSelect}
					showColumnBorders
					sortable
					defaultSortColumn='Date'
				/>
			</Table>
		)
	},
)

const FullColumnList = styled.div`
	display: flex;
	gap: 32px;
	margin-bottom: 20px;
`

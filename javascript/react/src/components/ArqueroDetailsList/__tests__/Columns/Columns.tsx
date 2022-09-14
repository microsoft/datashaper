/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ArqueroDetailsListProps } from '@datashaper/react'
import { ArqueroDetailsList } from '@datashaper/react'
import { Checkbox } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { Table } from '../ArqueroDetailsList.styles.js'
import { useCheckboxConfigs, useColumns } from './Columns.hooks.js'

export const Columns: React.FC<ArqueroDetailsListProps> = memo(
	function Columns({ table, ...args }) {
		const { checkboxes } = useCheckboxConfigs(table)

		const { columns } = useColumns(checkboxes)

		if (!table) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<FullColumnList>
					{checkboxes?.map(config => {
						return <Checkbox key={config.label} {...config} />
					})}
				</FullColumnList>
				<ArqueroDetailsList {...args} table={table} columns={columns} />
			</Table>
		)
	},
)

const FullColumnList = styled.div`
	display: flex;
	gap: 32px;
	margin-bottom: 20px;
`

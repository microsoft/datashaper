/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import { memo } from 'react'
import styled from 'styled-components'

import { ArqueroDetailsList } from '../../../ArqueroDetailsList/ArqueroDetailsList.js'
import { ArqueroTableHeader } from '../../../ArqueroTableHeader/ArqueroTableHeader.js'

export interface InputTablesProps {
	tables: TableContainer[]
}
export const InputTables: React.FC<InputTablesProps> = memo(
	function InputTables({ tables }) {
		if (!tables) {
			return <div>Loading...</div>
		}

		return (
			<Container>
				{tables.map((table) => {
					return (
						<Table key={table.id}>
							<ArqueroTableHeader name={table.id} table={table.table} />
							<ArqueroDetailsList
								table={table.table}
								isHeaderFixed
								styles={{ root: { height: 400 } }}
							/>
						</Table>
					)
				})}
			</Container>
		)
	},
)

const Container = styled.div`
	margin-top: 20px;
	display: flex;
	flex-wrap: wrap;
	gap: 40px;
`

const Table = styled.div`
	border: 1px solid ${({ theme }) => theme.palette.themePrimary};
	min-width: 600px;
	flex: 1;
`

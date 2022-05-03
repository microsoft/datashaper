/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification, Maybe } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { ProjectMgmtCommandBar } from '@data-wrangling-components/react'
import { memo, useState, useMemo } from 'react'
import styled from 'styled-components'
import { PrepareDataFull } from '@data-wrangling-components/react'

import { useTables } from './PrepareDataPage.hooks'
import { InputTables } from '../DebugPage/InputTables.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const { tables, onAddTables } = useTables()
	const [workflow, setWorkflow] = useState<Specification>({ output: [] })
	// workflow steps/output
	const [output, setOutput] = useState<TableContainer[]>([])

	return (
		<Container className={'prepare-data-page'}>
			<ProjectMgmtCommandBar
				tables={tables}
				workflow={workflow}
				outputTables={output}
				onUpdateWorkflow={setWorkflow}
				onUpdateTables={onAddTables}
				styles={mgmtStyles}
			/>
			<Wrapper>
				<PrepareDataFull
					inputs={tables}
					derived={output}
					workflow={workflow}
					onUpdateWorkflow={setWorkflow}
					onUpdateOutput={setOutput}
				/>
			</Wrapper>
		</Container>
	)
})

const Container = styled.div`
	height: calc(100vh - 80px);
	position: relative;
`

const Wrapper = styled.div`
	height: 90%;
`

const mgmtStyles = {
	root: {
		height: 36,
		paddingLeft: 9,
	},
}

function createTableMap(tables: TableContainer[]): Map<string, TableContainer> {
	return tables.reduce((prev, curr) => {
		prev.set(curr.id, curr)
		return prev
	}, new Map<string, TableContainer>())
}

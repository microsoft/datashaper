/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Workflow } from '@data-wrangling-components/core'
import {
	PrepareDataFull,
	ProjectMgmtCommandBar,
} from '@data-wrangling-components/react'
import type { TableContainer } from '@essex/arquero'
import { memo, useState } from 'react'
import styled from 'styled-components'

import { useTables } from './PrepareDataPage.hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const { tables, onAddTables } = useTables()
	const [workflow, setWorkflow] = useState<Workflow>(new Workflow())

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

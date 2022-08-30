/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { PrepareDataFull, ProjectMgmtCommandBar } from '@datashaper/react'
import { Workflow } from '@datashaper/workflow'
import { memo, useState } from 'react'

import { useTables } from './PrepareDataPage.hooks.js'
import { Container, mgmtStyles, Wrapper } from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const { tables, onAddTables } = useTables(setSelectedTableId)
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
					selectedTableId={selectedTableId}
					onSelectedTableIdChanged={setSelectedTableId}
					onUpdateOutput={setOutput}
					onUpdateWorkflow={setWorkflow}
				/>
			</Wrapper>
		</Container>
	)
})

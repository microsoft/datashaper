/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@datashaper/react'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { table } from 'arquero'
import { useState } from 'react'

const meta = {
	title: 'Prepare Data Full',
}

export default meta

const mockTable = table({
	ID: [1, 2, 3, 4, 5, 6],
	FY20: [10000, 56000, 45000, 5000, 8900, 90000],
	FY21: [5000, 4000, 45000, 6000, 9000, 78000],
})

/**
 * PrepareDataFullStory is PrepareDataFull based
 */
export const PrepareDataFullStory = (): JSX.Element => {
	const inputs = { table: mockTable, id: 'table1' } as TableContainer
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>(
		'table1',
	)

	const [outputs, setOutputs] = useState<TableContainer[]>([])

	// state for the input tables
	const [wf, setWorkflow] = useState<Workflow>(new Workflow())
	// workflow steps/output
	return (
		<PrepareDataFull
			derived={outputs}
			inputs={[inputs]}
			workflow={wf}
			onUpdateOutput={setOutputs}
			onUpdateWorkflow={setWorkflow}
			selectedTableId={selectedTableId}
			onSelectedTableIdChanged={setSelectedTableId}
		/>
	)
}

PrepareDataFullStory.story = {
	name: 'Prepare Data Full',
}

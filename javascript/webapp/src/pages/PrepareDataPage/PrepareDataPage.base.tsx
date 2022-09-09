/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PrepareDataFull,
	ProjectMgmtCommandBar,
	useOnDeleteStep,
	useOnSaveStep,
	useOnUpdateStep,
	usePerColumnCommands,
	useWorkflowListener,
	useWorkflowOutputListener,
} from '@datashaper/react'
import { useInputTableNames } from '@datashaper/react/src/hooks/useTableDropdownOptions.js'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { memo, useEffect, useState } from 'react'

import { useTables } from './PrepareDataPage.hooks.js'
import { Container, mgmtStyles, Wrapper } from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const { tables, onAddTables } = useTables(setSelectedTableId)
	const [workflow, setWorkflow] = useState<Workflow>(new Workflow())
	const onSave = useOnSaveStep(workflow, selectedTableId)
	const onUpdate = useOnUpdateStep(workflow)
	const onRemove = useOnDeleteStep(workflow)
	const inputNames = useInputTableNames(workflow)

	useEffect(() => {
		if (workflow.steps.length > 0) {
			const { id } = workflow.steps[workflow.steps.length - 1]
			setSelectedTableId(id)
		} else {
			if (workflow.inputNames.size > 0) {
				const lastInputName = inputNames[workflow.inputNames.size - 1]
				if (lastInputName) {
					setSelectedTableId(lastInputName)
				}
			}
		}
	}, [workflow, inputNames])

	// workflow steps/output
	const [output, setOutput] = useState<TableContainer[]>([])
	const columnCommands = usePerColumnCommands(
		workflow,
		onSave,
		onUpdate,
		onRemove,
	)
	useWorkflowOutputListener(workflow, setOutput)
	useWorkflowListener(workflow, setWorkflow)

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
					outputHeaderCommandBar={[columnCommands]}
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

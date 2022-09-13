/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PrepareDataFull,
	ProjectMgmtCommandBar,
	TableCommands,
	useOnSaveStep,
	useWorkflow,
	useWorkflowListener,
	useWorkflowOutputListener,
} from '@datashaper/react'
import { useOnCreateStep } from '@datashaper/react/src/hooks/manageWorkflow.js'
import { useInputTableNames } from '@datashaper/react/src/hooks/useTableDropdownOptions.js'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { memo, useEffect, useState } from 'react'

import { useTables } from './PrepareDataPage.hooks.js'
import { Container, mgmtStyles, Wrapper } from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const { tables: inputTables, onAddTables: onAddInputTables } =
		useTables(setSelectedTableId)
	const [wf, setWorkflow] = useState<Workflow>(new Workflow())
	const workflow = useWorkflow(wf, inputTables)

	const onSave = useOnSaveStep(workflow)
	const onCreate = useOnCreateStep(onSave, setSelectedTableId)
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
	useWorkflowOutputListener(workflow, setOutput)
	useWorkflowListener(workflow, setWorkflow)
	console.log(inputTables)
	return (
		<Container className={'prepare-data-page'}>
			<ProjectMgmtCommandBar
				tables={inputTables}
				workflow={workflow}
				outputTables={output}
				onUpdateWorkflow={setWorkflow}
				onUpdateTables={onAddInputTables}
				styles={mgmtStyles}
			/>
			<Wrapper>
				<PrepareDataFull
					outputHeaderCommandBar={
						<TableCommands
							inputTable={
								inputTables.find(x => x.id === selectedTableId) ||
								output.find(x => x.id === selectedTableId)
							}
							wf={workflow}
							onAddStep={onCreate}
						/>
					}
					inputs={inputTables}
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

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
import type { IColumn } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'

import { useStepListener, useTables } from './PrepareDataPage.hooks.js'
import { Container, mgmtStyles, Wrapper } from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	// state for the input tables
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const { tables: inputTables, onAddTables: onAddInputTables } =
		useTables(setSelectedTableId)
	const [wf, setWorkflow] = useState<Workflow>(new Workflow())
	// workflow steps/output
	const [output, setOutput] = useState<TableContainer[]>([])
	const workflow = useWorkflow(wf, inputTables)

	const onSave = useOnSaveStep(workflow)
	const onCreate = useOnCreateStep(onSave, setSelectedTableId)
	const inputNames = useInputTableNames(workflow)

	useStepListener(workflow, setSelectedTableId, inputNames)
	useWorkflowOutputListener(workflow, setOutput)
	useWorkflowListener(workflow, setWorkflow)

	const selectedTable = useMemo(() => {
		return inputTables.concat(output).find(x => x.id === selectedTableId)
	}, [inputTables, output, selectedTableId])

	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(column?.name)
		},
		[setSelectedColumn],
	)

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
							inputTable={selectedTable}
							workflow={workflow}
							onAddStep={onCreate}
							selectedColumn={selectedColumn}
						/>
					}
					inputs={inputTables}
					derived={output}
					workflow={workflow}
					onColumnClick={onColumnClick}
					selectedColumn={selectedColumn}
					selectedTableId={selectedTableId}
					onSelectedTableIdChanged={setSelectedTableId}
					onUpdateOutput={setOutput}
					onUpdateWorkflow={setWorkflow}
				/>
			</Wrapper>
		</Container>
	)
})

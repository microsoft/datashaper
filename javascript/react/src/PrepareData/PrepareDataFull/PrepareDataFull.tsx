/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { IRenderFunction, IDetailsColumnProps } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { ManageSteps } from '../../Steps/index.js'
import { TablesList, PreviewTable, OutputTable } from '../index.js'
import { useBusinessLogic } from './hooks.js'

export const PrepareDataFull: React.FC<{
	tables: TableContainer[]
	onUpdateSteps: (steps: Step[]) => void
	steps?: Step[]
	inputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	outputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function PrepareDataFull({
	tables,
	onUpdateSteps,
	steps,
	inputHeaderCommandBar,
	outputHeaderCommandBar,
}) {
	const {
		selectedTable,
		selectedTableName,
		setSelectedTableName,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		lastTableName,
	} = useBusinessLogic(tables, onUpdateSteps, steps)

	return (
		<Container>
			<InputContainer>
				<TablesListContainer>
					<SectionTitle>Inputs</SectionTitle>
					<InputDisplay>
						<TablesList
							tables={tables}
							selected={selectedTableName}
							onSelect={setSelectedTableName}
						/>
					</InputDisplay>
				</TablesListContainer>

				<PreviewContainer>
					<PreviewTable
						headerCommandBar={inputHeaderCommandBar}
						selectedMetadata={selectedMetadata}
						table={selectedTable}
						name={selectedTableName}
					/>
				</PreviewContainer>
			</InputContainer>

			<StepsTrayContainer>
				<StepsContainer>
					<SectionTitle>Steps</SectionTitle>
					<ManageSteps
						nextInputTable={lastTableName}
						onDelete={onDeleteStep}
						onSave={onSaveStep}
						onSelect={setSelectedTableName}
						store={store}
						steps={steps}
					/>
				</StepsContainer>
			</StepsTrayContainer>

			<OutputContainer>
				<SectionTitle>Output</SectionTitle>
				<OutputTable
					headerCommandBar={outputHeaderCommandBar}
					output={output}
					onTransform={onSaveStep}
				/>
			</OutputContainer>
		</Container>
	)
})

const SectionTitle = styled.span`
	padding-left: 10px;
	font-weight: bold;
	writing-mode: vertical-rl;
	transform: rotate(180deg);
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.application().lowMidContrast().hex()};
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
`

const PreviewContainer = styled.div`
	width: 78%;
	min-width: 300px;
`

const InputContainer = styled.div`
	height: 30%;
	display: flex;
	overflow: hidden;
	padding: 0px 20px 0px 10px;
`

const InputDisplay = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const OutputContainer = styled.div`
	padding: 0px 20px 10px 10px;
	height: 35%;
	display: flex;
`

const StepsTrayContainer = styled.div`
	min-height: 20%;
	max-height: 200px;
	padding: 12px 20px 12px 10px;
	margin: 20px 0px 20px 0px;
	background-color: ${({ theme }) => theme.application().faint().hex()};
`
const StepsContainer = styled.div`
	display: flex;
	overflow: auto;
	height: 100%;
`

const TablesListContainer = styled.div`
	display: flex;
	width: 26%;
	min-width: 250px;
`

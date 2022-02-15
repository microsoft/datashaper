/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import {
	IRenderFunction,
	IDetailsColumnProps,
	Separator,
} from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { StepsList } from '../../Steps/index.js'
import { TablesList, PreviewTable, OutputTable } from '../index.js'
import { useBusinessLogic } from './hooks.js'

export const PrepareDataFull: React.FC<{
	files: BaseFile[]
	onUpdateSteps: (steps: Step[]) => void
	steps?: Step[]
	inputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	outputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function PrepareDataFull({
	files,
	onUpdateSteps,
	steps,
	inputHeaderCommandBar,
	outputHeaderCommandBar,
}) {
	const {
		groupedTables,
		selectedTable,
		selectedTableName,
		setSelectedTableName,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		lastTableName,
	} = useBusinessLogic(files, onUpdateSteps, steps)

	return (
		<Container>
			<InputContainer>
				<TablesListContainer>
					<SectionTitle>Inputs</SectionTitle>
					<InputDisplay>
						<TablesList
							files={groupedTables}
							selected={selectedTableName}
							onSelect={setSelectedTableName}
						/>
					</InputDisplay>

					<SectionSeparator vertical />
				</TablesListContainer>
				<InputDetailsContainer>
					<PreviewContainer>
						<SectionTitle>Preview</SectionTitle>
						<PreviewTable
							headerCommandBar={inputHeaderCommandBar}
							selectedMetadata={selectedMetadata}
							table={selectedTable}
							name={selectedTableName}
						/>
					</PreviewContainer>
					<StepsContainer>
						<SectionTitle>Steps</SectionTitle>
						<StepsList
							nextInputTable={lastTableName}
							onDelete={onDeleteStep}
							onSave={onSaveStep}
							onSelect={setSelectedTableName}
							store={store}
							steps={steps}
						/>
					</StepsContainer>
				</InputDetailsContainer>
			</InputContainer>

			<OutputContainer>
				<SectionTitle>Output</SectionTitle>
				<OutputTable
					headerCommandBar={outputHeaderCommandBar}
					output={output}
					lastTableName={lastTableName}
					onTransform={onSaveStep}
				/>
			</OutputContainer>
		</Container>
	)
})

const SectionTitle = styled.span`
	font-weight: bold;
	writing-mode: vertical-rl;
	transform: rotate(180deg);
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.palette.neutralLight};
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
`

const PreviewContainer = styled.div`
	display: flex;
	height: 50%;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const InputContainer = styled.div`
	height: 50%;
	display: flex;
	overflow: hidden;
	padding-bottom: 10px;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const InputDisplay = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const OutputContainer = styled.div`
	padding: 10px;
	height: 45%;
	display: flex;
	width: 100%;
`

const SectionSeparator = styled(Separator)`
	padding: 14px;
	height: 90%;
`

const StepsContainer = styled.div`
	padding-bottom: 10px;
	height: 50%;
	display: flex;
	column-gap: 8px;
	overflow: auto;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const TablesListContainer = styled.div`
	display: flex;
	width: 26%;
`

const InputDetailsContainer = styled.div`
	width: 76%;
`

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Step } from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import {
	IRenderFunction,
	IDetailsColumnProps,
	Separator,
} from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { TablesList, PreviewTable, OutputTable } from '..'
import { StepsList } from '../../Steps'
import { DropzoneContainer, DropzoneProps } from '../../files'
import { useBusinessLogic } from './hooks'

export const PrepareDataFull: React.FC<{
	tables: BaseFile[]
	onUpdateSteps: (steps: Step[]) => void
	steps?: Step[]
	inputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	outputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	dropzoneProps?: DropzoneProps
}> = memo(function PrepareDataFull({
	tables,
	steps,
	onUpdateSteps,
	inputHeaderCommandBar,
	outputHeaderCommandBar,
	dropzoneProps,
}) {
	const {
		groupedTables,
		selectedTable,
		onSelect,
		onDeleteStep,
		onSaveStep,
		store,
		output,
		selectedMetadata,
		nextInputTable,
	} = useBusinessLogic(tables, onUpdateSteps, steps)

	return (
		<Container>
			<InputContainer>
				<TablesListContainer>
					<SectionTitle>Inputs</SectionTitle>
					<InputDisplay>
						{dropzoneProps && (
							<DropzoneContainer dropzoneProps={dropzoneProps} />
						)}

						<TablesList
							files={groupedTables}
							selected={selectedTable?.name}
							onSelect={onSelect}
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
						/>
					</PreviewContainer>
					<StepsContainer>
						<SectionTitle>Steps</SectionTitle>
						<StepsList
							nextInputTable={nextInputTable}
							onDelete={onDeleteStep}
							onSave={onSaveStep}
							onSelect={onSelect}
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
	height: 100%;
	position: fixed;
	width: 100%;
`

const PreviewContainer = styled.div`
	display: flex;
	height: 53%;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const InputContainer = styled.div`
	height: 47%;
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
`

const SectionSeparator = styled(Separator)`
	padding: 14px;
	height: 90%;
`

const StepsContainer = styled.div`
	padding-bottom: 10px;
	height: 47%;
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
	width: 70%;
`

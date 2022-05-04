/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@data-wrangling-components/core'
import type { TableContainer, TableMetadata } from '@essex/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { Icon } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { ManageWorkflow } from '../Workflow/index.js'
import { PreviewTable } from './index.js'
import { TableListBar } from './TableListBar/TableListBar.js'

export const PrepareDataFull: React.FC<{
	/**
	 * The static input tables
	 */
	inputs: TableContainer[]

	/**
	 * Derived output tables
	 */
	derived: TableContainer[]

	/**
	 * The data transformation workflow
	 */
	workflow: Workflow

	/**
	 * Handler for when the output table map changeus
	 */
	onUpdateOutput?: (tables: TableContainer[]) => void

	/**
	 * An optional command bar
	 */
	outputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]

	/**
	 * Step positioning option
	 */
	stepsPosition?: 'bottom' | 'middle'
}> = memo(function PrepareDataFull({
	inputs,
	derived,
	workflow,
	outputHeaderCommandBar,
	stepsPosition = 'bottom',
}) {
	const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
	const [selectedTableId, setSelectedTableName] = useState<string | undefined>()
	const selectedTable =
		derived.find(t => t.id === selectedTableId) ??
		inputs.find(t => t.id === selectedTableId)

	const onUpdateMetadata = useCallback(
		(meta: TableMetadata) => {
			if (selectedTable) {
				selectedTable.metadata = meta
			}
		},
		[selectedTable],
	)

	return (
		<Container>
			<InputContainer>
				<SectionTitle>Tables</SectionTitle>
				<TableListBar
					loading={false}
					inputs={inputs}
					derived={derived}
					selected={selectedTableId}
					onSelect={setSelectedTableName}
				/>
			</InputContainer>
			<StepsTrayContainer
				stepsPosition={stepsPosition}
				isCollapsed={isCollapsed}
				className="steps"
			>
				<SectionTitle isCollapsed={isCollapsed} onClick={toggleCollapsed}>
					Steps <Icon iconName="ChevronDown" />
				</SectionTitle>
				<WorkflowContainer>
					<ManageWorkflow
						inputs={inputs}
						workflow={workflow}
						onSelect={setSelectedTableName}
					/>
				</WorkflowContainer>
			</StepsTrayContainer>
			<OutputContainer stepsPosition={stepsPosition} isCollapsed={isCollapsed}>
				<SectionTitle>Preview</SectionTitle>
				<PreviewTable
					onChangeMetadata={onUpdateMetadata}
					headerCommandBar={outputHeaderCommandBar}
					table={selectedTable?.table}
					metadata={selectedTable?.metadata}
					name={selectedTableId}
				/>
			</OutputContainer>
		</Container>
	)
})

const GAP = 18
const INPUT_HEIGHT = 60
const STEPS_HEIGHT = 280
const COLLAPSED_STEPS_HEIGHT = 50

const SectionTitle = styled.span<{ isCollapsed?: boolean }>`
	margin: 0 ${GAP}px 0 ${GAP}px;
	font-weight: bold;
	writing-mode: vertical-rl;
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.application().lowMidContrast().hex()};
	transform: ${({ isCollapsed }) =>
		isCollapsed ? 'translate(2rem, 0) rotate(-90deg)' : 'rotate(180deg)'};
	cursor: pointer;
	display: flex;
	gap: 0.5rem;
	align-items: center;
`

const Container = styled.div`
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 100%;
	padding: ${GAP}px 0 ${GAP}px 0;
	gap: ${GAP}px;
	position: relative;
`

const InputContainer = styled.div`
	display: flex;
	min-height: ${INPUT_HEIGHT}px;
	flex: 0 1 ${INPUT_HEIGHT}px;
	padding-right: ${GAP}px;
	order: 1;
`

const OutputContainer = styled.div<{
	stepsPosition: string
	isCollapsed: boolean
}>`
	flex: 1 1 auto;
	display: flex;
	padding-right: ${GAP}px;
	max-height: ${({ isCollapsed }) =>
		`calc(100% - ${
			INPUT_HEIGHT + (isCollapsed ? 0 : STEPS_HEIGHT) + GAP * 4
		}px)`};
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 2 : 3)};
`

const StepsTrayContainer = styled.div<{
	stepsPosition: string
	isCollapsed: boolean
}>`
	display: flex;
	min-height: ${({ isCollapsed }) =>
		isCollapsed ? 'unset' : STEPS_HEIGHT + 'px'};
	background-color: ${({ theme }) => theme.application().faint().hex()};
	padding: 0;
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 3 : 2)};
	height: ${({ isCollapsed }) =>
		isCollapsed ? COLLAPSED_STEPS_HEIGHT + 'px' : 'auto'};
	overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'auto hidden')};
	> div {
		display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'grid')};
	}
`
const WorkflowContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
`

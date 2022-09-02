/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/schema'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback } from 'react'

import { HistoryButton } from './HistoryButton.js'
import { ManageWorkflow } from './ManageWorkflow.js'
import {
	Aside,
	AsideHeader,
	Container,
	InputContainer,
	Main,
	OutputContainer,
	SectionTitle,
	Title,
	WorkflowContainer,
} from './PrepareDataFull.styles.js'
import type { PrepareDataFullProps } from './PrepareDataFull.types.js'
import { PreviewTable } from './PreviewTable.js'
import { TableListBar } from './TableListBar.js'

export const PrepareDataFull: React.FC<PrepareDataFullProps> = memo(
	function PrepareDataFull({
		inputs,
		derived,
		workflow,
		selectedTableId,
		outputHeaderCommandBar,
		stepsPosition = 'bottom',
		onSelectedTableIdChanged,
		onUpdateOutput,
		onUpdateWorkflow,
	}) {
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)

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
			<Container isCollapsed={isCollapsed}>
				<Main>
					<InputContainer>
						<SectionTitle>Tables</SectionTitle>
						<TableListBar
							loading={false}
							inputs={inputs}
							derived={derived}
							selected={selectedTableId}
							onSelect={onSelectedTableIdChanged}
						/>
					</InputContainer>
					<OutputContainer stepsPosition={stepsPosition}>
						<SectionTitle>Preview</SectionTitle>
						<PreviewTable
							onChangeMetadata={onUpdateMetadata}
							headerCommandBar={outputHeaderCommandBar}
							table={selectedTable?.table}
							metadata={selectedTable?.metadata}
							name={selectedTableId}
						/>
					</OutputContainer>
				</Main>
				<Aside isCollapsed={isCollapsed}>
					<AsideHeader isCollapsed={isCollapsed}>
						<HistoryButton onClick={toggleCollapsed} />
						{isCollapsed ? (
							<span>({workflow?.steps?.length || 0})</span>
						) : (
							<Title isCollapsed={isCollapsed}>
								History ({workflow?.steps?.length || 0})
							</Title>
						)}
					</AsideHeader>
					<WorkflowContainer isCollapsed={isCollapsed}>
						<ManageWorkflow
							inputs={inputs}
							workflow={workflow}
							onSelect={onSelectedTableIdChanged}
							onUpdateOutput={onUpdateOutput}
							onUpdateWorkflow={onUpdateWorkflow}
							historyView={true}
						/>
					</WorkflowContainer>
				</Aside>
			</Container>
		)
	},
)

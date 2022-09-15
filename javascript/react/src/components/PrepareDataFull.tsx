/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback } from 'react'

import { ArqueroDetailsList } from './ArqueroDetailsList/ArqueroDetailsList.js'
import { ArqueroTableHeader } from './ArqueroTableHeader/ArqueroTableHeader.js'
import { DetailText } from './DetailText.js'
import { HistoryButton } from './HistoryButton.js'
import { ManageWorkflow } from './ManageWorkflow.js'
import {
	Aside,
	AsideHeader,
	Container,
	historyButtonStyles,
	icons,
	InputContainer,
	Main,
	OutputContainer,
	SectionTitle,
	TableContainer,
	TextContainer,
	Title,
	WorkflowContainer,
} from './PrepareDataFull.styles.js'
import type { PrepareDataFullProps } from './PrepareDataFull.types.js'
import { TableListBar } from './TableListBar.js'

export const PrepareDataFull: React.FC<PrepareDataFullProps> = memo(
	function PrepareDataFull({
		inputs,
		derived,
		workflow,
		selectedTableId,
		outputHeaderCommandBar,
		stepsPosition = 'bottom',
		selectedColumn,
		onColumnClick,
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
						{isCollapsed ? (
							<HistoryButton
								onClick={toggleCollapsed}
								steps={workflow?.steps?.length}
								showText={true}
							/>
						) : null}
					</InputContainer>
					<OutputContainer stepsPosition={stepsPosition}>
						<SectionTitle>Preview</SectionTitle>
						{selectedTable?.table ? (
							<TableContainer>
								<ArqueroTableHeader
									commandBar={outputHeaderCommandBar}
									name={selectedTable?.id}
									table={selectedTable?.table}
								/>
								<ArqueroDetailsList
									isSortable
									compact
									showColumnBorders
									isHeadersFixed
									isColumnClickable={!!onColumnClick}
									selectedColumn={selectedColumn}
									onColumnClick={onColumnClick}
									onChangeMetadata={onUpdateMetadata}
									metadata={selectedTable?.metadata}
									table={selectedTable?.table}
								/>
							</TableContainer>
						) : (
							<TextContainer>
								<DetailText text="(No table selected)" />
							</TextContainer>
						)}
					</OutputContainer>
				</Main>
				<Aside isCollapsed={isCollapsed}>
					<AsideHeader isCollapsed={isCollapsed}>
						<HistoryButton styles={historyButtonStyles} />
						<Title isCollapsed={isCollapsed}>
							History ({workflow?.steps?.length || 0})
							<IconButton
								iconProps={icons.cancel}
								onClick={toggleCollapsed}
								ariaLabel="Close"
							/>
						</Title>
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

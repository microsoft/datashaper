/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@essex/arquero'
import { Icon } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useState } from 'react'

import { ManageWorkflow } from './ManageWorkflow.js'
import {
	Container,
	InputContainer,
	OutputContainer,
	SectionTitle,
	StepsTrayContainer,
	WorkflowContainer,
} from './PrepareDataFull.styles.js'
import type { PrepareDataFullProps } from './PrepareDataFull.types.js'
import { PreviewTable } from './PreviewTable.jsx'
import { TableListBar } from './TableListBar.jsx'

export const PrepareDataFull: React.FC<PrepareDataFullProps> = memo(
	function PrepareDataFull({
		inputs,
		derived,
		workflow,
		outputHeaderCommandBar,
		stepsPosition = 'bottom',
		onUpdateOutput,
	}) {
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const [selectedTableId, setSelectedTableName] = useState<
			string | undefined
		>()
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
							onUpdateOutput={onUpdateOutput}
						/>
					</WorkflowContainer>
				</StepsTrayContainer>
				<OutputContainer
					stepsPosition={stepsPosition}
					isCollapsed={isCollapsed}
				>
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
	},
)

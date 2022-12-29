/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	DisplayOrder,
	StepList,
	TableCommands,
} from '@datashaper/react'
import { KnownProfile } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useObservableState } from 'observable-hooks'
import { memo, useMemo, useState } from 'react'

import {
	useColumnState,
	useHistoryButtonCommandBar,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useSelectedTable,
	useTableName,
} from './BundleEditor.hooks.js'
import {
	Container,
	DetailsListContainer,
	useTableCommandProps,
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from './BundleEditor.styles.js'
import type { BundleEditorProps } from './BundleEditor.types.js'

export const BundleEditor: React.FC<BundleEditorProps> = memo(
	function BundleEditor({ resource }) {
		// Primary State
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const [workflow, isWorkflowAttached] = useMemo<[Workflow, boolean]>(() => {
			const result = resource
				.getSourcesWithProfile(KnownProfile.Workflow)
				.find(t => !!t) as Workflow | undefined
			return [result ?? new Workflow(), !!result]
			/* eslint-disable-next-line react-hooks/exhaustive-deps */
		}, [resource, resource.sources])

		const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
		const [selectedColumn, onColumnClick] = useColumnState()

		// Derived State
		const numSteps = useObservableState(workflow.length$, workflow.length)
		const toolPanelHeader = useMemo(
			() => `Workflow steps (${numSteps})`,
			[numSteps],
		)
		const tableName = useTableName(resource, selectedId)
		const selectedTable = useSelectedTable(resource, selectedId)
		const historyButtonCommandBar = useHistoryButtonCommandBar(
			isCollapsed,
			numSteps,
			toggleCollapsed,
		)
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const tableCommandProps = useTableCommandProps()
		const toolPanelStyles = useToolPanelStyles()

		// Event Handlers
		const onSave = useOnSaveStep(workflow, resource, isWorkflowAttached)
		const onCreate = useOnCreateStep(onSave, setSelectedId)
		const onDelete = useOnDeleteStep(workflow, resource)

		return selectedTable?.table == null ? null : (
			<Container collapsed={isCollapsed}>
				<DetailsListContainer>
					<ArqueroTableHeader
						background={tableHeaderColors.background}
						styles={tableHeaderStyles}
						commandBar={
							<TableCommands
								{...tableCommandProps}
								workflow={workflow}
								selectedColumn={selectedColumn}
								onAddStep={onCreate}
								onRemoveStep={onDelete}
							/>
						}
						farCommandBar={<CommandBar {...historyButtonCommandBar} />}
						name={tableName}
						table={selectedTable.table}
					/>
					<ArqueroDetailsList
						compact
						sortable
						showColumnBorders
						isHeaderFixed
						fill
						selectedColumn={selectedColumn}
						metadata={selectedTable.metadata}
						table={selectedTable?.table}
						onColumnSelect={onColumnClick}
					/>
				</DetailsListContainer>
				{
					<ToolPanel
						headerText={toolPanelHeader}
						onDismiss={toggleCollapsed}
						headerIconProps={HISTORY_ICON_PROPS}
						styles={toolPanelStyles}
					>
						<StepList
							order={DisplayOrder.LastOnTop}
							selectedKey={selectedId}
							workflow={workflow}
							onSave={onSave}
							onDelete={onDelete}
							onSelect={setSelectedId}
						/>
					</ToolPanel>
				}
			</Container>
		)
	},
)

const HISTORY_ICON_PROPS = {
	iconName: 'History',
}

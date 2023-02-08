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
import type { TableBundle } from '@datashaper/workflow'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback, useMemo, useState } from 'react'
import type { ProfileComponentProps } from '../../../types.js'

import { useToolPanelExpandCollapse } from '../hooks.js'
import {
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from '../styles.js'
import {
	useColumnState,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useSelectedTable,
	useTableCommandProps,
} from './TableBundleEditor.hooks.js'
import { Container, DetailsListContainer } from './TableBundleEditor.styles.js'

export const TableBundleEditor: React.FC<ProfileComponentProps<TableBundle>> =
	memo(function TableBundleEditor({ resource }) {
		const [workflow, isWorkflowAttached] = useMemo<[Workflow, boolean]>(() => {
			const result = resource
				.getSourcesWithProfile(KnownProfile.Workflow)
				.find((t) => !!t) as Workflow | undefined
			const defaultWorkflow = () => {
				const workflow = new Workflow()
				workflow.input$ = resource.output$
				return workflow
			}
			return [result ?? defaultWorkflow(), !!result]
			/* eslint-disable-next-line react-hooks/exhaustive-deps */
		}, [resource, resource.sources])

		const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
		const [isLatestSelected, setIsLatestSelected] = useState(true)
		const [isInputSelected, setIsInputSelected] = useState(false)
		const [selectedColumn, onColumnClick] = useColumnState()
		console.log(workflow.toSchema())
		// Derived State
		const numSteps = useObservableState(workflow.length$, workflow.length)
		const toolPanelHeader = useMemo(
			() => `Workflow steps (${numSteps})`,
			[numSteps],
		)
		const selectedTable = useSelectedTable(
			resource,
			selectedId,
			isInputSelected,
			isLatestSelected,
		)
		const { collapsed, onToggleCollapsed, commandBar, iconProps } =
			useToolPanelExpandCollapse(
				'history-button',
				'History',
				`(${numSteps ?? '0'})`,
			)

		const toolPanelStyles = useToolPanelStyles()
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const tableCommandProps = useTableCommandProps()

		// Event Handlers
		const onSave = useOnSaveStep(workflow, resource, isWorkflowAttached)
		const onCreate = useOnCreateStep(onSave, setSelectedId)
		const onDelete = useOnDeleteStep(workflow, resource)

		const onSelectTable = useCallback(
			(id: string) => {
				setSelectedId(id)
				setIsLatestSelected(false)
				setIsInputSelected(false)
			},
			[setSelectedId],
		)
		const onSelectInputTable = useCallback(() => {
			setSelectedId(undefined)
			setIsLatestSelected(false)
			setIsInputSelected(true)
		}, [setSelectedId])
		const onSelectLatestTable = useCallback(() => {
			setSelectedId(undefined)
			setIsLatestSelected(true)
			setIsInputSelected(false)
		}, [setSelectedId])
		const name = `${resource.name}${selectedId ? `@${selectedId}` : ''}${
			isInputSelected ? '@input' : ''
		}`
		return selectedTable?.table == null ? null : (
			<Container collapsed={collapsed}>
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
						farCommandBar={workflow ? <CommandBar {...commandBar} /> : null}
						name={name}
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
						features={{
							statsColumnHeaders: true,
							histogramColumnHeaders: true,
						}}
					/>
				</DetailsListContainer>
				{!collapsed && (
					<ToolPanel
						headerText={toolPanelHeader}
						onDismiss={onToggleCollapsed}
						headerIconProps={iconProps}
						styles={toolPanelStyles}
					>
						<StepList
							order={DisplayOrder.LastOnTop}
							selectedKey={selectedId}
							workflow={workflow}
							onSave={onSave}
							onDelete={onDelete}
							onSelect={onSelectTable}
							onSelectInputTable={onSelectInputTable}
							onSelectLatestTable={onSelectLatestTable}
						/>
					</ToolPanel>
				)}
			</Container>
		)
	})

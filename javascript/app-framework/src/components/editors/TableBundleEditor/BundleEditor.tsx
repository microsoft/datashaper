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
import type { Workflow } from '@datashaper/workflow'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo, useMemo, useState } from 'react'
import { EMPTY } from 'rxjs'

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
	useTableName,
} from './BundleEditor.hooks.js'
import { Container, DetailsListContainer } from './BundleEditor.styles.js'
import type { BundleEditorProps } from './BundleEditor.types.js'

export const BundleEditor: React.FC<BundleEditorProps> = memo(
	function BundleEditor({ resource }) {
		const workflow = useMemo<Workflow | undefined>(() => {
			return resource
				.getSourcesWithProfile(KnownProfile.Workflow)
				.find(t => !!t) as Workflow | undefined
			/* eslint-disable-next-line react-hooks/exhaustive-deps */
		}, [resource, resource.sources])

		const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
		const [selectedColumn, onColumnClick] = useColumnState()

		// Derived State
		const numSteps = useObservableState(
			workflow?.length$ ?? EMPTY,
			workflow?.length ?? 0,
		)
		const toolPanelHeader = useMemo(
			() => `Workflow steps (${numSteps})`,
			[numSteps],
		)
		const tableName = useTableName(resource, selectedId)
		const selectedTable = useSelectedTable(resource, selectedId)
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
		const onSave = useOnSaveStep(workflow!)
		const onCreate = useOnCreateStep(onSave, setSelectedId)
		const onDelete = useOnDeleteStep(workflow!)

		return selectedTable?.table == null ? null : (
			<Container collapsed={collapsed}>
				<DetailsListContainer>
					<ArqueroTableHeader
						background={tableHeaderColors.background}
						styles={tableHeaderStyles}
						commandBar={
							workflow ? (
								<TableCommands
									{...tableCommandProps}
									workflow={workflow}
									selectedColumn={selectedColumn}
									onAddStep={onCreate}
									onRemoveStep={onDelete}
								/>
							) : null
						}
						farCommandBar={workflow ? <CommandBar {...commandBar} /> : null}
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
				{workflow ? (
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
							onSelect={setSelectedId}
						/>
					</ToolPanel>
				) : null}
			</Container>
		)
	},
)

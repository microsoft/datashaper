/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type { DataTableSchema } from '@datashaper/schema'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useDataTableSource } from '../../../hooks/index.js'
import { DataTableSchemaComponent } from '../../DataTableSchemaComponent/DataTableSchemaComponent.js'
import { useToolPanelExpandCollapse } from '../hooks.js'
import {
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from '../styles.js'
import { Container, DetailsListContainer } from './TableEditor.styles.js'
import type { TableEditorProps } from './TableEditor.types.js'

export const TableEditor: React.FC<TableEditorProps> = memo(
	function TableEditor({ resource }) {
		const table = useDataTableSource(resource)
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const toolPanelStyles = useToolPanelStyles()
		const { collapsed, onToggleCollapsed, commandBar, iconProps } =
			useToolPanelExpandCollapse('options-button', 'DataManagementSettings')
		const onChangeSchema = useCallback(
			(update: Partial<DataTableSchema>) => {
				resource?.loadSchema(update)
			},
			[resource],
		)
		return table?.table == null ? null : (
			<Container collapsed={collapsed}>
				<DetailsListContainer>
					<ArqueroTableHeader
						background={tableHeaderColors.background}
						styles={tableHeaderStyles}
						farCommandBar={<CommandBar {...commandBar} />}
						table={table.table}
					/>
					<ArqueroDetailsList
						compact
						sortable
						showColumnBorders
						isHeaderFixed
						fill
						metadata={table.metadata}
						table={table?.table}
					/>
				</DetailsListContainer>
				<ToolPanel
					headerText={'Parser options'}
					onDismiss={onToggleCollapsed}
					headerIconProps={iconProps}
					styles={toolPanelStyles}
				>
					<DataTableSchemaComponent
						schema={resource.toSchema()}
						onChange={onChangeSchema}
					/>
				</ToolPanel>
			</Container>
		)
	},
)

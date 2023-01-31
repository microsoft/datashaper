/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { memo } from 'react'

import { useDataTableSource } from '../../../hooks/index.js'
import { DataTableConfig } from '../../DataTableConfig/DataTableConfig.js'
import { useToolPanelExpandCollapse } from '../hooks.js'
import {
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from '../styles.js'
import {
	ConfigContainer,
	Container,
	DetailsListContainer,
} from './DataTableEditor.styles.js'
import type { DataTableEditorProps } from './DataTableEditor.types.js'

export const DataTableEditor: React.FC<DataTableEditorProps> = memo(
	function DataTableEditor({ resource }) {
		const table = useDataTableSource(resource)
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const toolPanelStyles = useToolPanelStyles()
		const { collapsed, onToggleCollapsed, commandBar, iconProps } =
			useToolPanelExpandCollapse('options-button', 'DataManagementSettings')
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
					<ConfigContainer>
						<DataTableConfig resource={resource} />
					</ConfigContainer>
				</ToolPanel>
			</Container>
		)
	},
)

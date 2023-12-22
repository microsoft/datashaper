/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataGraph } from '@datashaper/workflow'
import { memo } from 'react'
import { ToolPanel } from '@essex/components'
import type { ProfileComponentProps } from '../../../types.js'
import {
	ConfigContainer,
	Container,
	GraphContainer,
	MainContainer,
	Header,
} from './DataGraphEditor.styles.js'
import { When } from 'react-if'
import { useNodesInputTable } from './DataGraphEditor.hooks.js'
import { useToolPanelStyles } from '../styles.js'
import { useToolPanelExpandCollapse } from '../hooks.js'
import { CommandBar } from '@fluentui/react'
import { CartesianPointBindings } from './CartesianPointBindings/index.js'
import { GraphViewer } from './GraphViewer/GraphViewer.js'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export const DataGraphEditor: React.FC<ProfileComponentProps<DataGraph>> = memo(
	function DataGraphEditor({ resource }) {
		const nodesInputTable = useNodesInputTable(resource)

		const toolPanelStyles = useToolPanelStyles()
		const { collapsed, onToggleCollapsed, commandBar, iconProps } =
			useToolPanelExpandCollapse('options-button', 'DataManagementSettings')
		return (
			<Container collapsed={collapsed}>
				<MainContainer>
					<Header>
						<CommandBar {...commandBar} />
					</Header>
					<GraphContainer>
						<When condition={!!nodesInputTable}>
							<GraphViewer
								nodesTable={nodesInputTable as ColumnTable}
								nodeBindings={resource.nodes.bindings}
							/>
						</When>
					</GraphContainer>
				</MainContainer>

				<ToolPanel
					headerText={'Data bindings'}
					onDismiss={onToggleCollapsed}
					headerIconProps={iconProps}
					styles={toolPanelStyles}
				>
					<ConfigContainer>
						<CartesianPointBindings
							bindings={resource.nodes.bindings}
							table={nodesInputTable}
						/>
					</ConfigContainer>
				</ToolPanel>
			</Container>
		)
	},
)

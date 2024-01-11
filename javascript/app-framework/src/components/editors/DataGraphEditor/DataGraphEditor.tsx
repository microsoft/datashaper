/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataGraph } from '@datashaper/workflow'
import { memo, useState } from 'react'
import { ToolPanel, useSliderProps } from '@essex/components'
import type { ProfileComponentProps } from '../../../types.js'
import {
	ConfigContainer,
	Container,
	GraphContainer,
	MainContainer,
	Header,
} from './DataGraphEditor.styles.js'
import { When } from 'react-if'
import {
	useEdgesInputTable,
	useNodesInputTable,
} from './DataGraphEditor.hooks.js'
import { useToolPanelStyles } from '../styles.js'
import { useToolPanelExpandCollapse } from '../hooks.js'
import { CommandBar, Slider } from '@fluentui/react'

import { GraphViewer } from '../../GraphViewer/GraphViewer.js'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { EdgeBindings } from './bindings/EdgeBindings/EdgeBindings.js'
import { NodeBindings } from './bindings/NodeBindings/NodeBindings.js'
import styled from 'styled-components'
export const DataGraphEditor: React.FC<ProfileComponentProps<DataGraph>> = memo(
	function DataGraphEditor({ resource }) {
		const nodesInputTable = useNodesInputTable(resource)
		const edgesInputTable = useEdgesInputTable(resource)

		const toolPanelStyles = useToolPanelStyles()
		const { expanded, onToggleCollapsed, commandBar, iconProps } =
			useToolPanelExpandCollapse('options-button', 'DataManagementSettings', {
				defaultExpanded: true,
			})

		const [edgeProportion, setEdgeProportion] = useState<number>(0)
		return (
			<Container expanded={expanded}>
				<MainContainer>
					<Header>
						<CommandBar {...commandBar} />
					</Header>
					<GraphContainer>
						<When condition={!!nodesInputTable}>
							<GraphViewer
								nodesTable={nodesInputTable as ColumnTable}
								edgesTable={edgesInputTable as ColumnTable}
								nodesDefinition={resource.nodes}
								edgesDefinition={resource.edges}
								edgeProportion={edgeProportion}
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
						<NodeHeader />
						<NodeBindings definition={resource.nodes} table={nodesInputTable} />
					</ConfigContainer>
					<ConfigContainer>
						<EdgeHeader
							proportion={edgeProportion}
							onChanged={setEdgeProportion}
						/>
						<EdgeBindings definition={resource.edges} table={edgesInputTable} />
					</ConfigContainer>
				</ToolPanel>
			</Container>
		)
	},
)

const Head = styled.div`
	font-size: 20px;
	font-weight: bold;
	text-transform: uppercase;
	padding-left: 10px;
	height: 48px;
	display: flex;
	gap: 12px;
	align-items: center;
	border-top: 1px solid ${({ theme }) => theme.palette.neutralTertiary};
	border-bottom: 2px solid ${({ theme }) => theme.palette.neutralSecondary};
`

const NodeHeader: React.FC = memo(function NodeHeader() {
	return <Head>Nodes</Head>
})

const EdgeHeader: React.FC<{
	proportion: number
	onChanged: (newValue: number) => void
}> = memo(function EdgeHeader({ proportion, onChanged }) {
	const sliderProps = useSliderProps(
		{
			defaultValue: proportion,
			min: 0,
			max: 1,
			step: 0.01,
			onChanged: (_, c) => onChanged(c),
			styles: {
				root: {
					width: 180,
				},
			},
		},
		'small',
	)
	return (
		<Head>
			Edges <Slider {...sliderProps} />
		</Head>
	)
})
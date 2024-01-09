/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { NodeBindingsProps } from './NodeBindings.types.js'

import { Column, ObservableColumnBinding } from '../Column.js'
import { NumericColumn } from '../NumericColumn.js'
import { ColorScale } from '../ColorScale.js'
import { CollapsiblePanelContainer, CollapsiblePanel } from '@essex/components'

export const NodeBindings: React.FC<NodeBindingsProps> = memo(
	function NodeBindings({ definition, table }) {
		const bindings = definition.bindings
		return (
			<CollapsiblePanelContainer>
				<CollapsiblePanel title='Node ID' styles={panelStyles}>
					<ObservableColumnBinding
						table={table}
						observable={definition.identifier$}
						initial={definition.identifier}
						onChange={(update) => {
							definition.identifier = update
						}}
					/>
				</CollapsiblePanel>
				<CollapsiblePanel title='Node X position' styles={panelStyles}>
					<Column table={table} binding={bindings.x} />
				</CollapsiblePanel>
				<CollapsiblePanel title='Node Y position' styles={panelStyles}>
					<Column table={table} binding={bindings.y} />
				</CollapsiblePanel>
				<CollapsiblePanel title='Node size' styles={panelStyles}>
					<NumericColumn binding={bindings.size} table={table} />
				</CollapsiblePanel>
				<CollapsiblePanel title='Node fill' styles={panelStyles}>
					<ColorScale binding={bindings.fill} table={table} />
				</CollapsiblePanel>
			</CollapsiblePanelContainer>
		)
	},
)

const panelStyles = {
	content: {
		paddingLeft: 10,
	},
}

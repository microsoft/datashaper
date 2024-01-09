/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { EdgeBindingsProps } from './EdgeBindings.types.js'
import { NumericColumn } from '../NumericColumn.js'
import { CollapsiblePanelContainer, CollapsiblePanel } from '@essex/components'
import { ColorPicker } from '@fluentui/react'
import { ObservableColumnBinding } from '../Column.js'

export const EdgeBindings: React.FC<EdgeBindingsProps> = memo(
	function EdgeBindings({ definition, table }) {
		const bindings = definition.bindings
		return (
			<CollapsiblePanelContainer>
				{/* TODO: there is no protection against setting the source and target the same here, which will fail */}
				<CollapsiblePanel title='Edge source' styles={panelStyles}>
					<ObservableColumnBinding
						table={table}
						observable={definition.source$}
						initial={definition.source}
						onChange={(update) => {
							definition.source = update
						}}
					/>
				</CollapsiblePanel>
				<CollapsiblePanel title='Edge target' styles={panelStyles}>
					<ObservableColumnBinding
						table={table}
						observable={definition.target$}
						initial={definition.target}
						onChange={(update) => {
							definition.target = update
						}}
					/>
				</CollapsiblePanel>
				<CollapsiblePanel title='Edge width' styles={panelStyles}>
					<NumericColumn binding={bindings.width} table={table} />
				</CollapsiblePanel>
				<CollapsiblePanel title='Edge color' styles={panelStyles}>
					<ColorPicker
						color={bindings.stroke || 'white'}
						onChange={(_, color) => {
							bindings.stroke = color.str
						}}
						alphaType='none'
					/>
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

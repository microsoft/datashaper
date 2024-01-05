/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { EdgeBindingsProps } from './EdgeBindings.types.js'
import { NumericColumn } from '../NumericColumn.js'
import { CollapsiblePanelContainer, CollapsiblePanel } from '@essex/components'
import { ColorPicker } from '@fluentui/react'

export const EdgeBindings: React.FC<EdgeBindingsProps> = memo(
	function EdgeBindings({ bindings, table }) {
		return (
			<CollapsiblePanelContainer>
				<CollapsiblePanel title='Edge width' styles={panelStyles}>
					<NumericColumn binding={bindings.width} table={table} />
				</CollapsiblePanel>
				<CollapsiblePanel title='Edge color' styles={panelStyles}>
					<ColorPicker
						color={bindings.stroke}
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

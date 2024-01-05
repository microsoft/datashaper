/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, FlexContainer } from './EdgeBindings.styles.js'

import type { EdgeBindingsProps } from './EdgeBindings.types.js'

import { Column } from '../Column.js'
import { NumericColumn } from '../NumericColumn.js'
import { BindingSection } from '../BindingSection.js'
import { ColorScale } from '../ColorScale.js'

export const EdgeBindings: React.FC<EdgeBindingsProps> = memo(
	function EdgeBindings({ bindings, table }) {
		return (
			<Container>
				<FlexContainer>
					{/* <BindingSection label={'Node X position'}>
						<Column table={table} binding={bindings.x} />
					</BindingSection>
					<BindingSection label={'Node Y position'}>
						<Column table={table} binding={bindings.y} />
					</BindingSection> */}
					<BindingSection label={'Edge width'}>
						<NumericColumn binding={bindings.width} table={table} />
					</BindingSection>
					<BindingSection label={'Edge color'}>
						{/* <ColorScale binding={bindings.stroke} table={table} /> */}
					</BindingSection>
				</FlexContainer>
			</Container>
		)
	},
)

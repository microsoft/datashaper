/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, FlexContainer } from './NodeBindings.styles.js'

import type { NodeBindingsProps } from './NodeBindings.types.js'

import { Column } from '../Column.js'
import { NumericColumn } from '../NumericColumn.js'
import { BindingSection } from '../BindingSection.js'
import { ColorScale } from '../ColorScale.js'

export const NodeBindings: React.FC<NodeBindingsProps> = memo(
	function NodeBindings({ bindings, table }) {
		return (
			<Container>
				<FlexContainer>
					<BindingSection label={'Node X position'}>
						<Column table={table} binding={bindings.x} />
					</BindingSection>
					<BindingSection label={'Node Y position'}>
						<Column table={table} binding={bindings.y} />
					</BindingSection>
					<BindingSection label={'Node size'}>
						<NumericColumn binding={bindings.size} table={table} />
					</BindingSection>
					<BindingSection label={'Node fill'}>
						<ColorScale binding={bindings.fill} table={table} />
					</BindingSection>
				</FlexContainer>
			</Container>
		)
	},
)

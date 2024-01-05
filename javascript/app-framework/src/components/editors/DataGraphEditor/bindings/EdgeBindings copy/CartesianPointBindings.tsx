/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, FlexContainer } from './CartesianPointBindings.styles.js'

import type { CartesianPointBindingsProps } from './CartesianPointBindings.types.js'

import { Column } from '../Column.js'
import { NumericColumn } from '../NumericColumn.js'
import { BindingSection } from '../BindingSection.js'
import { FillColor } from '../ColorScale.js'

export const CartesianPointBindings: React.FC<CartesianPointBindingsProps> =
	memo(function CartesianPointBindings({ bindings, table }) {
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
						<FillColor binding={bindings.fill} table={table} />
					</BindingSection>
				</FlexContainer>
			</Container>
		)
	})

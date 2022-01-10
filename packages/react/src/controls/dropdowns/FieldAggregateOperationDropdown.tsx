/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateRollupOperation } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import React, { memo } from 'react'
import { opDropdownStyles } from '../styles'

export type FieldAggregateOperationDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const FieldAggregateOperationDropdown: React.FC<FieldAggregateOperationDropdownProps> =
	memo(function FieldAggregateOperationDropdown(props) {
		return (
			<Dropdown
				required
				label={'Function'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	})

const options = Object.values(FieldAggregateRollupOperation).map(o => ({
	key: o,
	text: o,
}))

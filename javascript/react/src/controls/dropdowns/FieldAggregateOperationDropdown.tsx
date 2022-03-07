/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { opDropdownStyles } from '../styles.js'

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

const options = Object.values(FieldAggregateOperation).map(o => ({
	key: o,
	text: o,
}))

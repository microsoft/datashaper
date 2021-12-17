/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import { isArray } from 'lodash'
import React, { memo } from 'react'

export interface DefaultCellProps {
	item?: any
	index?: number
	column?: IColumn
}

export const DefaultCell: React.FC<DefaultCellProps> = memo(
	function DefaultCell({ item, index, column }) {
		// TODO: how do we want to handle null/undefined? optional text?
		let value = column?.fieldName && item[column.fieldName]
		if (typeof value === 'boolean') {
			value = value.toString()
		} else if (isArray(value)) {
			value = value.join(',')
		}
		return (
			<div
				style={{
					textAlign: typeof value === 'number' ? 'right' : 'left',
				}}
			>
				{value}
			</div>
		)
	},
)

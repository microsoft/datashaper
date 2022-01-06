/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { getValue } from '../util'
import { FormattedCellProps } from './types'

/**
 * Basic rendering of objects.
 */
export const ObjectCell: React.FC<FormattedCellProps> = memo(
	function ObjectCell({ item, column, textAlign = 'left' }) {
		const value = getValue(item, column) || {}
		return (
			<div
				style={{
					textAlign,
				}}
			>
				{value.toString()}
			</div>
		)
	},
)

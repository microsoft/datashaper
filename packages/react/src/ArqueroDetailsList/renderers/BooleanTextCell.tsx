/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { getValue } from '../util'
import { FormattedCellProps } from './types'

/**
 * Basic rendering of boolean values as true/false text.
 */
export const BooleanTextCell: React.FC<FormattedCellProps> = memo(
	function TextCell({ item, column, textAlign = 'left' }) {
		const value = !!getValue(item, column)
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

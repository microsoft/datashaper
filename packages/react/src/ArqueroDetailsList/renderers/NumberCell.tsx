/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isNil } from 'lodash'
import React, { memo } from 'react'
import { getValue } from '../util'
import { FormattedCellProps } from './types'

/**
 * Basic endering of number values.
 */
export const NumberCell: React.FC<FormattedCellProps> = memo(
	function NumberCell({ item, column, textAlign = 'right' }) {
		let value = getValue(item, column)
		if (isNil(value)) {
			value = ''
		}
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { format } from 'd3-format'
import { isNil } from 'lodash'
import React, { memo, useMemo } from 'react'
import { getValue } from '../util'
import { FormattedCellProps } from './types'
/**
 * Basic endering of number values.
 */
export const NumberCell: React.FC<FormattedCellProps> = memo(
	function NumberCell({ item, column, textAlign = 'right', numberFormat }) {
		const value = getValue(item, column)
		const printed = useFormatted(value, numberFormat)
		return (
			<div
				style={{
					textAlign,
				}}
			>
				{printed}
			</div>
		)
	},
)

function useFormatted(value: number | undefined, formatter?: string): string {
	return useMemo(() => {
		if (isNil(value)) {
			return ''
		}
		if (formatter) {
			const f = format(formatter)
			return f(value)
		}
		return value.toString()
	}, [value, formatter])
}

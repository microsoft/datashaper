/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { format } from 'd3-format'
import { isNil } from 'lodash'
import { useMemo } from 'react'
import { Dimensions } from './types'

export function useCellDimensions(column?: IColumn): Dimensions {
	return useMemo(
		() => ({
			width: column?.currentWidth || 0,
			height: 20,
		}),
		[column],
	)
}

export function useFormattedNumber(
	value: number | undefined,
	formatter?: string,
): string {
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

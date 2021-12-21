/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
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

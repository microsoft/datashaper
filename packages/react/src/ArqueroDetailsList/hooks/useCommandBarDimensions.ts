/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { Dimensions } from '../renderers/types'

export function useCommandBarDimensions(): () => Dimensions {
	return useCallback(() => {
		const dimensions = document.getElementsByClassName(
			'header-command-bar',
		)[0] as HTMLElement
		return {
			width: dimensions?.offsetWidth || 0,
			height: dimensions?.offsetHeight || 0,
		}
	}, [])
}

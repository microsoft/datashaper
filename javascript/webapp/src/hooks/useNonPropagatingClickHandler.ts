/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

export function useNonPropagatingClickHandler(
	onClick: () => void,
): (e: React.MouseEvent) => void {
	return useCallback(
		(e: React.MouseEvent<unknown>) => {
			e.stopPropagation()
			onClick()
		},
		[onClick],
	)
}

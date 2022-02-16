/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

export function useIsTableSelected(
	selected?: string,
): (tableName: string) => boolean {
	return useCallback(
		(tableName: string) => {
			return selected === tableName
		},
		[selected],
	)
}

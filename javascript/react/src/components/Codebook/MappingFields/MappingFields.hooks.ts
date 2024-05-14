/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

export function useHandleAddButtonClick(
	onChange?: (mapping: Record<any, any>) => void,
	values?: Record<any, any>,
): () => void {
	return useCallback(() => {
		onChange?.({
			...values,
			' ': '',
		})
	}, [onChange, values])
}

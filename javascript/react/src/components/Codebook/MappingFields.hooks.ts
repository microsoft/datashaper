/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataType } from '@datashaper/schema'
import { useCallback } from 'react'

export function useHandleAddButtonClick(
	onChange?: (mapping: Record<any, any>) => void,
	values?: Record<any, any>,
	dataType?: DataType,
): () => void {
	return useCallback(() => {
		const newValue = dataType === DataType.Number ? 0 : ''
		onChange?.({
			...values,
			' ': newValue,
		})
	}, [onChange, dataType, values])
}

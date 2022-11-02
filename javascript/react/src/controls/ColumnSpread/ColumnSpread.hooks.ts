/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import type { ColumnSpreadProps } from './ColumnSpread.types.js'

export function useHandleColumnChange(
	onChange: ColumnSpreadProps['onChange'],
): (e: any, opt: string | undefined) => void {
	return useCallback(
		(_e: any, opt: string | undefined) => {
			opt && onChange?.(opt)
		},
		[onChange],
	)
}

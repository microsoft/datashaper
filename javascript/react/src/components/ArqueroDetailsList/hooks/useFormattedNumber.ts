/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import { formatNumber } from '../../common/functions.js'

export function useFormattedNumber(
	value: number | undefined,
	formatter?: string,
): string {
	return useMemo(() => formatNumber(value, formatter), [value, formatter])
}

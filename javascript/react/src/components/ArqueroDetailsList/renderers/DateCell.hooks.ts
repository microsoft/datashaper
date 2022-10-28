/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

export function useDateString(value: Date | undefined) {
	return useMemo(() => value?.toDateString(), [value])
}

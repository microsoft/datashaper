/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useValues(categories: Record<string | number, number>) {
	return useMemo(() => Object.values(categories), [categories])
}

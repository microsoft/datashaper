/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useItems(items: any[], virtual: any[]): any[] {
	return useMemo(() => [...items, ...virtual], [items, virtual])
}

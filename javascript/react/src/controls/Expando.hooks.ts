/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

/**
 * Manage expando state to toggle visibility of the children.
 * @param inputs
 * @returns
 */
export function useExpando(defaultExpanded = false): {
	expanded: boolean
	onToggle: () => void
} {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded)

	const onToggle = useCallback(() => setExpanded(prev => !prev), [setExpanded])
	return {
		expanded,
		onToggle,
	}
}

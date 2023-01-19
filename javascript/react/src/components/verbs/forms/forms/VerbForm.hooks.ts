/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo, useState } from 'react'

import type { FormInput } from './types.js'

/**
 * Sort the inputs into regular and advanced groups
 * @param inputs
 * @returns
 */
export function useSortedInputs(inputs: FormInput<any>[]): {
	regular: FormInput<any>[]
	advanced: FormInput<any>[]
	showAdvanced: boolean
	expanded: boolean
	onToggleAdvanced: () => void
} {
	const regular = useMemo(() => inputs.filter((i) => !i.advanced), [inputs])
	const advanced = useMemo(() => inputs.filter((i) => i.advanced), [inputs])

	const [expanded, setExpanded] = useState<boolean>(false)

	const onToggleAdvanced = useCallback(
		() => setExpanded((prev) => !prev),
		[setExpanded],
	)

	return {
		regular,
		advanced,
		showAdvanced: advanced.some((input) => input.if ?? true),
		expanded,
		onToggleAdvanced,
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import { useCallback, useMemo } from 'react'

export function useOnToggle(
	ref: React.MutableRefObject<AllotmentHandle | null>,
	expanded: boolean,
	toggleExpanded: () => void,
) {
	return useCallback(() => {
		if (expanded) {
			ref?.current?.resize([60])
		} else {
			ref?.current?.reset()
		}
		toggleExpanded()
	}, [expanded, toggleExpanded])
}

export function useOnChangeWidth(
	expanded: boolean,
	toggleExpanded: () => void,
): (sizes: number[]) => void {
	const changeWidth = useCallback(
		(sizes: number[]) => {
			const menuSize = sizes[0] ?? 0
			if ((menuSize < 150 && expanded) || (menuSize > 150 && !expanded)) {
				toggleExpanded()
			}
		},
		[expanded, toggleExpanded],
	)

	return useDebounceFn(
		(sizes: number[]) => {
			changeWidth(sizes)
		},
		{ wait: 200 },
	).run
}

export function useHandlerArgs(selectedKey: string | undefined): {
	handler?: string | undefined
	args?: string[] | undefined
} {
	return useMemo(() => {
		if (selectedKey != null) {
			const tokens = selectedKey?.split('|')
			if (tokens.length > 0) {
				return {
					handler: tokens[0],
					args: tokens.slice(1),
				}
			}
		}
		return {}
	}, [selectedKey])
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import { useCallback, useMemo } from 'react'

const BREAK_WIDTH = 150
const COLLAPSED_WIDTH = 60

export function useOnToggle(
	ref: React.MutableRefObject<AllotmentHandle | null>,
	expanded: boolean,
	toggleExpanded: () => void,
): () => void {
	return useCallback(() => {
		if (expanded) {
			ref?.current?.resize([COLLAPSED_WIDTH])
		} else {
			ref?.current?.reset()
		}
		toggleExpanded()
	}, [ref, expanded, toggleExpanded])
}

export function useOnChangeWidth(
	expanded: boolean,
	collapse: () => void,
	expand: () => void,
): (sizes: number[]) => void {
	const changeWidth = useCallback(
		(sizes: number[]) => {
			if (sizes.length > 0) {
				const menuSize = sizes[0] as number
				if (menuSize < BREAK_WIDTH && expanded) {
					collapse()
				} else if (menuSize >= BREAK_WIDTH && !expanded) {
					expand()
				}
			}
		},
		[expanded, collapse, expand],
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

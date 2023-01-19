/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IButtonProps, IGroup } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useIntersection(
	element: HTMLDivElement | undefined,
	rootMargin: string,
): boolean {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry?.isIntersecting ?? false)
			},
			{ rootMargin },
		)
		element && observer.observe(element)

		return () => element && observer.unobserve(element)
	}, [element, rootMargin])

	return isVisible
}

export function useCountChildren(): (children: IGroup[]) => number {
	const countChildren = useCallback((children: IGroup[]) => {
		let total = 0
		children.forEach((child) => {
			total += child.count
			total += child.children ? countChildren(child.children) : 0
		})
		return total
	}, [])
	return countChildren
}

export function useLevelButtonProps(collapsed = false): Partial<IButtonProps> {
	const theme = useTheme()
	return useMemo(
		() => ({
			iconProps: {
				iconName: collapsed ? 'ChevronRight' : 'ChevronDown',
				styles: {
					root: {
						fontSize: 10,
						color: theme.palette.neutralSecondary,
					},
				},
			},
		}),
		[collapsed, theme],
	)
}

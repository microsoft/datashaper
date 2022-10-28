/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Category, FieldMetadata } from '@datashaper/schema'
import { formatIfNumber } from '@datashaper/tables'
import type { ICalloutProps } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { HISTOGRAM_HEADER_PADDING } from '../ArqueroDetailsList.constants.js'
import type { Dimensions } from './types.js'

export function useCategories(
	stats?: FieldMetadata,
	categorical?: boolean,
): Category[] {
	return useMemo(() => {
		if (categorical) {
			return stats?.categories || EMPTY_ARRAY
		}
		return (stats?.bins || EMPTY_ARRAY).map(b => ({
			name: `${b.min}`,
			count: b.count,
		}))
	}, [stats, categorical])
}

export function useTooltip(categories: Category[]): string {
	return useMemo(() => {
		return categories.reduce((acc, cur, idx) => {
			const { name, count } = cur
			return acc + (idx > 0 ? '\n' : '') + `${formatIfNumber(name)}: ${count}`
		}, '')
	}, [categories])
}

export function useLegend(categories: Category[]): string[] {
	return useMemo(() => {
		return categories.map(cat => `${formatIfNumber(cat.name)}: ${cat.count}`)
	}, [categories])
}

export function useHandleBarHoverHandler(
	legend: string[],
	setId: (id: string | undefined) => void,
	setHover: (target: string | undefined) => void,
) {
	return useCallback(
		(e: MouseEvent) => {
			const { target, type } = e
			const index = (target as any).dataset.index
			const id = (target as any).id
			if (type === 'mouseover' && index >= 0) {
				setHover(legend[index] || '')
				setId(id)
			} else {
				setHover(undefined)
				setId(undefined)
			}
		},
		[legend, setHover, setId],
	)
}

export function useStyles(dimensions: Dimensions, hasOnClickHandler: boolean) {
	return useMemo(() => {
		return {
			height: dimensions.height + HISTOGRAM_HEADER_PADDING,
			cursor: hasOnClickHandler ? 'pointer' : 'inherit',
		}
	}, [hasOnClickHandler, dimensions])
}

export function useCalloutProps(id: string | undefined): ICalloutProps {
	return useMemo(() => ({ gapSpace: 5, target: `#${id}` }), [id])
}

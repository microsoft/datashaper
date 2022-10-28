/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import type { ColumnClickFunction } from '../ArqueroDetailsList.types.js'
import { useCellDimensions } from '../hooks/index.js'

const COMPACT_LINE_HEIGHT = 2

export function useContainerStyle(column: IColumn) {
	const dimensions = useCellDimensions(column)
	return useMemo(
		() => ({
			lineHeight: column.data.compact ? COMPACT_LINE_HEIGHT : 'inherit',
			display: 'flex',
			justifyContent: 'space-between',
			width: dimensions.width,
		}),
		[dimensions, column],
	)
}

export function useTextStyle(column: IColumn, isClickable: boolean) {
	const theme = useTheme()
	return useMemo(
		() => ({
			cursor: isClickable ? 'pointer' : 'inherit',
			color: column?.data.virtual
				? 'transparent'
				: column.data?.selected
				? theme.palette.themePrimary
				: theme.palette.neutralPrimary,
			width: '100%',
			textAlign: 'center' as const,
			overflow: 'hidden' as const,
			whiteSpace: 'nowrap' as const,
			textOverflow: 'ellipsis' as const,
		}),
		[theme, column, isClickable],
	)
}

export function useIconStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				cursor: 'pointer',
				position: 'absolute' as const,
				right: 8,
				fontSize: 12,
				color: theme.palette.neutralSecondary,
			},
		}),
		[theme],
	)
}

export function useDelegatedColumnClickHandler(
	column: IColumn | undefined,
	delegate: ColumnClickFunction | undefined,
) {
	return useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			delegate?.(e, column)
		},
		[column, delegate],
	)
}

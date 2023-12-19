/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn, IIconStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import type { ColumnSelectFunction } from '../ArqueroDetailsList.types.js'
import { useCellDimensions } from '../hooks/index.js'

export function useContainerStyle(column: IColumn): React.CSSProperties {
	const dimensions = useCellDimensions(column)
	return useMemo(
		() => ({
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: dimensions.width,
			// If there is no min-height, the label drifts to the top of the cell.
			// This isn't quite controllable by us based on the ms-DetailsHeader styling mix of css and imperative.
			// Only applies in compact mode - regular sets a fixed height of 42px, negating this issue.
			minHeight: 32,
		}),
		[dimensions],
	)
}

export function useTextStyle(
	column: IColumn,
	isClickable: boolean,
): React.CSSProperties {
	const theme = useTheme()
	return useMemo(
		() => ({
			cursor: isClickable ? 'pointer' : 'inherit',
			color: column.data?.virtual
				? 'transparent'
				: column.data?.selected
				? theme.palette.themePrimary
				: theme.palette.neutralPrimary,
			width: '100%',
			textAlign: 'center' as const,
			overflow: 'hidden' as const,
			whiteSpace: 'nowrap' as const,
			textOverflow: 'ellipsis' as const,
			paddingLeft: 7, // this splits the icon margin to center the label
		}),
		[theme, column, isClickable],
	)
}

export function useIconStyles(): IIconStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				cursor: 'pointer',
				fontSize: 12,
				width: 14, // to match the default icon on the left
				color: theme.palette.neutralSecondary,
			},
		}),
		[theme],
	)
}

export function useDelegatedColumnClickHandler(
	column: IColumn | undefined,
	delegate: ColumnSelectFunction | undefined,
): (e: React.MouseEvent<HTMLElement, MouseEvent>) => void {
	return useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			delegate?.(e, column)
		},
		[column, delegate],
	)
}

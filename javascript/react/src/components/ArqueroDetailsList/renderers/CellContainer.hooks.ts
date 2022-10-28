/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import type React from 'react'
import { useCallback, useMemo } from 'react'

import type { CellContainerProps } from './CellContainer.types.js'

export function useHandleColumnClick(
	column: IColumn | undefined,
	onClick: CellContainerProps['onClick'],
): (ev: React.MouseEvent<HTMLElement>) => void {
	return useCallback(
		(ev: React.MouseEvent<HTMLElement>) => {
			column && onClick?.(ev, column)
		},
		[column, onClick],
	)
}

export function useCellStyle(
	column: IColumn | undefined,
	onClick: CellContainerProps['onClick'],
): React.CSSProperties {
	return useMemo<React.CSSProperties>(() => {
		const style: React.CSSProperties = {}

		if (onClick) {
			style.cursor = 'pointer'
		}

		if (column?.data?.selected) {
			style.fontWeight = 'bold'
		}
		return style
	}, [onClick, column?.data?.selected])
}

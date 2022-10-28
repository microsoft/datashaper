/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { useMemo } from 'react'

import type { ColumnClickFunction } from '../ArqueroDetailsList.types.js'

export function useCellStyle(
	column: IColumn | undefined,
	onColumnClick: ColumnClickFunction | undefined,
): React.CSSProperties {
	return useMemo(() => {
		const style: React.CSSProperties = {
			width: '100%',
		}
		if (onColumnClick) {
			style.cursor = 'pointer'
		}
		if (column?.data?.selected) {
			style.fontWeight = 'bold'
		}
		return style
	}, [onColumnClick, column])
}

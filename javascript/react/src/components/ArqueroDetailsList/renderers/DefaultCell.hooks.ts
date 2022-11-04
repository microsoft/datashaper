/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { useMemo } from 'react'

import type { ColumnSelectFunction } from '../ArqueroDetailsList.types.js'

export function useCellStyle(
	column: IColumn | undefined,
	onSelect: ColumnSelectFunction | undefined,
): React.CSSProperties {
	return useMemo(() => {
		const style: React.CSSProperties = {
			width: '100%',
		}
		if (onSelect) {
			style.cursor = 'pointer'
		}
		if (column?.data?.selected) {
			style.fontWeight = 'bold'
		}
		return style
	}, [onSelect, column])
}

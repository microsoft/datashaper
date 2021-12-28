/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { useMemo } from 'react'

export function useCellClickhandler(
	clickable: boolean,
	onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column?: IColumn) => void,
): ((ev: React.MouseEvent<HTMLElement>, column?: IColumn) => void) | undefined {
	return useMemo(
		() =>
			clickable
				? (ev: React.MouseEvent<HTMLElement>, column?: IColumn) =>
						onColumnClick && onColumnClick(ev, column)
				: undefined,
		[clickable, onColumnClick],
	)
}

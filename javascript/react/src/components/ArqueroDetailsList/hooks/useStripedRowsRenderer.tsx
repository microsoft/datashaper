/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsRowProps } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { useCallback } from 'react'

import { ROW_NUMBER_COLUMN_NAME } from '../ArqueroDetailsList.constants.js'
import { StripedRow } from '../renderers/index.js'

/**
 *
 * @param striped -
 * @returns
 */
export function useStripedRowsRenderer(
	striped: boolean,
	columnBorders: boolean,
	compactRowHeight: number,
	hideRowNumber?: boolean,
): IRenderFunction<IDetailsRowProps> {
	return useCallback(
		(props: IDetailsRowProps | undefined) => {
			if (!props) {
				return null
			}
			if (!hideRowNumber) {
				props.item = {
					[ROW_NUMBER_COLUMN_NAME]: props.itemIndex + 1,
					...props.item,
				}
			}
			return (
				<StripedRow
					{...props}
					striped={striped}
					columnBorders={columnBorders}
					compactRowHeight={compactRowHeight}
					hideRowNumber={hideRowNumber}
				/>
			)
		},
		[striped, columnBorders, compactRowHeight, hideRowNumber],
	)
}

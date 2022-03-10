/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsRowProps } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { useCallback } from 'react'

import { StripedRow } from '../renderers/index.js'

/**
 *
 * @param striped
 * @returns
 */
export function useStripedRowsRenderer(
	striped = false,
	columnBorders = false,
): IRenderFunction<IDetailsRowProps> {
	return useCallback(
		(props?) => {
			if (!props) {
				return null
			}
			return (
				<StripedRow
					{...props}
					striped={striped}
					columnBorders={columnBorders}
				/>
			)
		},
		[striped, columnBorders],
	)
}

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
 * @param striped -
 * @returns
 */
export function useStripedRowsRenderer(
	striped: boolean,
	columnBorders: boolean,
): IRenderFunction<IDetailsRowProps> {
	return useCallback(
		(props: IDetailsRowProps | undefined) => {
			if (!props) {
				return null
			}
			// passing along compact is resulting in inf. loop in ArqueroDetailsList story (Fill Story)
			const { compact, ...rest } = props
			return (
				<StripedRow {...rest} striped={striped} columnBorders={columnBorders} />
			)
		},
		[striped, columnBorders],
	)
}

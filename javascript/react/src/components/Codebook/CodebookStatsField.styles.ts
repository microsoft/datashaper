/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { IColumn } from '@fluentui/react'
import { Label } from '@fluentui/react'
import { useMemo } from 'react'

import type { CodebookStatsStyles } from './CodebookStatsField.types.js'

export function useStatsStyles(
	styles?: CodebookStatsStyles,
): CodebookStatsStyles {
	return useMemo(
		() => ({
			histogram: {
				currentWidth: 230,
			} as IColumn,
			...styles,
		}),
		[styles],
	)
}

export const Flex = styled.div`
	display: flex;
`
export const FieldName = styled(Label)`
	margin: auto;
`

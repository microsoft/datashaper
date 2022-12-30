/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ArqueroTableHeaderStyles } from '@datashaper/react'
import { MessageBar, useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

export const DatasetContainer = styled.div`
	max-height: calc(100% - 82px);
	height: 100%;
`

export const Message = styled(MessageBar)``

export const DetailsListContainer = styled.div`
	height: 100%;
`

export function useHeaderStyles(): ArqueroTableHeaderStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				background: theme.palette.white,
				height: 36,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}

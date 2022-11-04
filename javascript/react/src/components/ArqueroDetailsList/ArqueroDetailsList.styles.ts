/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

import {
	COMPACT_ROW_HEIGHT,
	DEFAULT_ROW_HEIGHT,
} from './ArqueroDetailsList.constants.js'

export const DetailsWrapper = styled.div<{ compact: boolean }>`
	height: inherit;
	max-height: inherit;
	overflow-y: auto;
	overflow-x: auto;
	span.ms-DetailsHeader-cellTitle {
		background-color: ${({ theme }) => theme.palette.white};
		padding-left: 10px;
	}

	.ms-List-cell {
		min-height: ${({ compact }) =>
			compact ? COMPACT_ROW_HEIGHT : DEFAULT_ROW_HEIGHT}px;
		height: ${({ compact }) =>
			compact ? COMPACT_ROW_HEIGHT : DEFAULT_ROW_HEIGHT}px;
	}

	.ms-CommandBar {
		padding: unset;
	}

	.ms-OverflowSet {
		justify-content: center;
	}
`

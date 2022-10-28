/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const DetailsWrapper = styled.div<{ showColumnBorders: boolean }>`
	height: inherit;
	max-height: inherit;
	overflow-y: auto;
	overflow-x: auto;
	span.ms-DetailsHeader-cellTitle {
		background-color: ${({ theme }) => theme.palette.white};
	}

	.ms-List-cell {
		min-height: unset;
	}

	.ms-CommandBar {
		padding: unset;
	}

	.ms-OverflowSet {
		justify-content: center;
	}
`

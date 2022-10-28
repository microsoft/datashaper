/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { STATS_HEADER_ITEM_HEIGHT } from '../ArqueroDetailsList.constants.js'

export const Container = styled.div`
	height: ${STATS_HEADER_ITEM_HEIGHT}px;
	display: flex;
	justify-content: space-between;
	padding-left: 4px;
	padding-right: 4px;
	line-height: 1px;
`
export const Name = styled.div`
	text-transform: capitalize;
`
export const Value = styled.div`
	max-width: '100%';
	overflow: 'hidden';
	white-space: 'nowrap';
	text-overflow: 'ellipsis';
`

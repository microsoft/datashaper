/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { formatIfNumber } from '@datashaper/tables'
import { memo } from 'react'

import { Container, Name, Value } from './StatCell.styles.js'
import type { StatCellProps } from './StatCell.types.js'
import { pretty } from './StatsColumnHeader.constants.js'

export const StatCell: React.FC<StatCellProps> = memo(function StatCell({
	name,
	value,
}) {
	return value != null ? (
		<Container>
			<Name>{pretty[name] || name}:</Name>
			<Value>{formatIfNumber(value)}</Value>
		</Container>
	) : null
})

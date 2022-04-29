/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { useTableColumnNames , useTableNames } from '@data-wrangling-components/react-hooks'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

import { useLoadTable } from '../../common/hooks.js'
import type { StepComponentProps } from '../../types.js'
import { JoinBase } from './Join.base.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps<JoinArgs>> = memo(function Join({
	step,
	store,
	input,
	onChange,
}) {
	const tableNames = useTableNames(store)
	const leftTable = useLoadTable(
		input || step.input[NodeInput.Source]?.node,
		undefined,
		store,
	)
	const rightTable = useLoadTable(
		step.input[NodeInput.Other]?.node,
		undefined,
		store,
	)
	const leftColumns = useTableColumnNames(leftTable)
	const rightColumns = useTableColumnNames(rightTable)

	return (
		<JoinBase
			step={step}
			onChange={onChange}
			tables={tableNames}
			leftColumns={leftColumns}
			rightColumns={rightColumns}
		/>
	)
})

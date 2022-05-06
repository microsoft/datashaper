/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

import { BooleanLogicBase } from './BooleanLogic.base.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps<BooleanArgs>> = memo(
	withLoadedTable<BooleanArgs>(function BooleanLogic({
		step,
		onChange,
		dataTable,
	}) {
		const columns = useTableColumnNames(dataTable)
		return (
			<BooleanLogicBase step={step} onChange={onChange} columns={columns} />
		)
	}),
)

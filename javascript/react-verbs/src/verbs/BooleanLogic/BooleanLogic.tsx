/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import { memo } from 'react'

import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { memo } from 'react'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
import { BooleanLogicBase } from './BooleanLogic.base.js'
import { useTableColumnOptions } from '@data-wrangling-components/react-hooks'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps<BooleanArgs>> = memo(
	withLoadedTable<BooleanArgs>(function BooleanLogic({
		step,
		onChange,
		dataTable,
	}) {
		const options = useTableColumnOptions(dataTable)
		return (
			<BooleanLogicBase step={step} onChange={onChange} options={options} />
		)
	}),
)

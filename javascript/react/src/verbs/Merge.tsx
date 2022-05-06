/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

import { MergeBase } from './Merge.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Merge: React.FC<StepComponentProps<MergeArgs>> = memo(
	withLoadedTable(function Merge({ step, onChange, dataTable }) {
		const columnNames = useTableColumnNames(dataTable)
		return <MergeBase step={step} onChange={onChange} columns={columnNames} />
	}),
)

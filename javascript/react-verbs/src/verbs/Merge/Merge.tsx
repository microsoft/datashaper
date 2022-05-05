/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
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

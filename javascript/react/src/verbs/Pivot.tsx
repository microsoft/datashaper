/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

import { PivotBase } from './Pivot.base.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Pivot: React.FC<StepComponentProps<PivotArgs>> = memo(
	withLoadedTable(function Pivot({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)

		return <PivotBase step={step} onChange={onChange} columns={columns} />
	}),
)

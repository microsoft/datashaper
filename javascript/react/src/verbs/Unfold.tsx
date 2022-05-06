/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { UnfoldBase } from './Unfold.base.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Unfold: React.FC<StepComponentProps<UnfoldArgs>> = memo(
	withLoadedTable(function Unfold({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <UnfoldBase step={step} onChange={onChange} columns={columns} />
	}),
)

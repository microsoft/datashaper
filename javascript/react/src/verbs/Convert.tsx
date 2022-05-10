/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { ConvertBase } from './Convert.base.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	withLoadedTable(function Convert({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <ConvertBase columns={columns} step={step} onChange={onChange} />
	}),
)

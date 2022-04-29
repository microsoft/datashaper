/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { memo } from 'react'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
import { useTableColumnOptions } from '@data-wrangling-components/react-hooks'
import { ConvertBase } from './Convert.base.jsx'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	withLoadedTable(function Convert({ step, onChange, dataTable }) {
		const columns = useTableColumnOptions(dataTable)
		return <ConvertBase columns={columns} step={step} onChange={onChange} />
	}),
)

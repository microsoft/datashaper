/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

import { EraseBase } from './Erase.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Erase: React.FC<StepComponentProps<EraseArgs>> = memo(
	withLoadedTable(function Erase({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)

		return <EraseBase step={step} onChange={onChange} columns={columns} />
	}),
)

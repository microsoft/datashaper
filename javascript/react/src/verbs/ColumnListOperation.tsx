/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { memo } from 'react'

import { ColumnListOperationBase } from './ColumnListOperation.base.js'
/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperation: React.FC<
	StepComponentProps<InputColumnListArgs>
> = memo(
	withLoadedTable(function ColumnListOperation({ dataTable, step, onChange }) {
		const columns = useTableColumnNames(dataTable)

		return (
			<ColumnListOperationBase
				step={step}
				onChange={onChange}
				columns={columns}
			/>
		)
	}),
)

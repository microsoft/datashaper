/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import { memo } from 'react'

import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
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

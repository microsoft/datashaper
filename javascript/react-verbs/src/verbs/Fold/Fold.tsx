/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@data-wrangling-components/core'
import { memo } from 'react'
import type { StepComponentProps } from '../../types.js'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import { FoldBase } from './Fold.base.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Fold: React.FC<StepComponentProps<FoldArgs>> = memo(
	withLoadedTable(function Fold({ step, dataTable, onChange }) {
		const columns = useTableColumnNames(dataTable)
		return <FoldBase step={step} onChange={onChange} columns={columns} />
	}),
)

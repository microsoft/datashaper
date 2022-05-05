/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo } from 'react'

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

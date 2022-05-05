/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo } from 'react'

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

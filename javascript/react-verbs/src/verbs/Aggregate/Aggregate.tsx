/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { withLoadedTable } from '../../common/withLoadedTable.js'
import { useTableColumnOptions } from '@data-wrangling-components/react-controls'
import { AggregateBasic } from './AggregateBasic.js'

/*
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate = memo(
	withLoadedTable<AggregateArgs>(function Aggregate({
		step,
		onChange,
		dataTable,
	}) {
		const options = useTableColumnOptions(dataTable)
		return (
			<AggregateBasic columnOptions={options} step={step} onChange={onChange} />
		)
	}),
)

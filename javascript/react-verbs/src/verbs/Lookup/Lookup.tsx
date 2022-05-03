/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@data-wrangling-components/core'
import {
	useTableColumnNames,
	useTableNames,
} from '@data-wrangling-components/react-hooks'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

import { useLoadTable } from '../../common/hooks.js'
import type { StepComponentProps } from '../../types.js'
import { LookupBase } from './Lookup.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps<LookupArgs>> = memo(
	function Lookup({ step, store, table, onChange }) {
		const rightTable = useLoadTable(
			step.input[NodeInput.Other]?.node,
			undefined,
			store,
		)
		const tables = useTableNames(store)
		const leftColumns = useTableColumnNames(table)
		const rightColumns = useTableColumnNames(rightTable)
		return (
			<LookupBase
				step={step}
				onChange={onChange}
				tables={tables}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)

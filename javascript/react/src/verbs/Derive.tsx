/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { useStepDataTable,useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { DeriveBase } from './Derive.base.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps<DeriveArgs>> = memo(
	function Derive({ step, graph, input, table, onChange }) {
		const dataTable = useStepDataTable(step, graph, input, table)
		const columns = useTableColumnNames(dataTable)
		return <DeriveBase columns={columns} step={step} onChange={onChange} />
	},
)

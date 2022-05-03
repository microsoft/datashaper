/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@data-wrangling-components/core'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import { memo } from 'react'

import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { ImputeBase } from './Impute.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Impute: React.FC<StepComponentProps<ImputeArgs>> = memo(
	withLoadedTable(function Impute({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <ImputeBase step={step} onChange={onChange} columns={columns} />
	}),
)

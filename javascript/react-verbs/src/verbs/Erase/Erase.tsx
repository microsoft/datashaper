/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
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

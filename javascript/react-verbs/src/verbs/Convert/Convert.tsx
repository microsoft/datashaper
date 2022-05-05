/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo } from 'react'

import { ConvertBase } from './Convert.base.jsx'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	withLoadedTable(function Convert({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <ConvertBase columns={columns} step={step} onChange={onChange} />
	}),
)

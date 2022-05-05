/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@data-wrangling-components/core'
import { withLoadedTable } from '@data-wrangling-components/react-hocs'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo } from 'react'

import { DeriveBase } from '../index.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps<DeriveArgs>> = memo(
	withLoadedTable(function Derive({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <DeriveBase columns={columns} step={step} onChange={onChange} />
	}),
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@data-wrangling-components/core'
import { useTableColumnNames } from '@data-wrangling-components/react-hooks'
import { memo } from 'react'

import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { useTableNames } from '@data-wrangling-components/react-hooks'
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { JoinBase } from './Join.base.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps<JoinArgs>> = memo(function Join({
	step,
	store,
	onChange,
}) {
	const tableNames = useTableNames(store)
	return <JoinBase step={step} onChange={onChange} tables={tableNames} />
})

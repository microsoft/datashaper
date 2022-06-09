/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import {
	dropdown,
	inputColumnList,
	joinInputs,
} from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Lookup step.
 */
export const LookupBase: React.FC<
	StepComponentBaseProps<LookupArgs> & {
		tables: string[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function LookupBase({
	step,
	onChange,
	tables,
	leftColumns,
	rightColumns,
}) {
	const inputs = useMemo<FormInput<LookupArgs>[]>(
		() => [
			dropdown(
				'Join table',
				tables,
				step.input[NodeInput.Other]?.node,
				(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
				{ required: true, placeholder: 'Choose column' },
			),
			...joinInputs(step, leftColumns, rightColumns, 'lookup'),
			inputColumnList(step, rightColumns, 'Columns to copy'),
		],
		[step, leftColumns, rightColumns, tables],
	)

	return <VerbForm inputs={inputs} onChange={onChange} step={step} />
})

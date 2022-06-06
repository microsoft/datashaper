/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { JoinStrategy } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import {
	dropdown,
	enumDropdown,
	joinInputs,
} from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinBase: React.FC<
	StepComponentBaseProps<JoinArgs> & {
		tables: string[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function JoinBase({
	step,
	onChange,
	tables,
	leftColumns,
	rightColumns,
}) {
	const inputs = useMemo<FormInput<JoinArgs>[]>(
		() => [
			dropdown(
				'Join table',
				tables,
				step.input[NodeInput.Other]?.node,
				(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
				{ required: true }
			),
			enumDropdown(
				'Join strategy',
				JoinStrategy,
				step.args.strategy,
				(s, val) => (s.args.strategy = val as JoinStrategy),
				{ required: true }
			),
			...joinInputs(step, leftColumns, rightColumns),
		],
		[step, leftColumns, rightColumns, tables],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})

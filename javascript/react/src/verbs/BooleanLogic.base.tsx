/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import { enumDropdown, inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogicBase: React.FC<
	StepComponentBaseProps<BooleanArgs> & {
		columns: string[]
	}
> = memo(function BooleanLogicBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<BooleanArgs>[]>(
		() => [
			inputColumnList(step, columns),
			enumDropdown(
				'Logical operator',
				BooleanOperator,
				step.args.operator,
				(s, opt) => (s.args.operator = opt as BooleanOperator),
				{ required: true, placeholder: 'Choose boolean' },
				{
					or: 'OR',
					and: 'AND',
					nor: 'NOR',
					nand: 'NAND',
					xor: 'XOR',
				},
			),
		],
		[step, columns],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})

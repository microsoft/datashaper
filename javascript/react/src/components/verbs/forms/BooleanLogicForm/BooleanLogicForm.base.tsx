/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@datashaper/schema'
import { BooleanOperator } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, enumDropdown, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogicFormBase: React.FC<StepFormBaseProps<BooleanArgs>> =
	memo(function BooleanLogicFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<BooleanArgs>[]>(
			() => [
				enumDropdown(
					'Logical operator',
					BooleanOperator,
					step.args.operator,
					(s, opt) => {
						s.args.operator = opt as BooleanOperator
					},
					{ required: true, placeholder: 'Choose boolean' },
					{
						or: 'OR',
						and: 'AND',
						nor: 'NOR',
						nand: 'NAND',
						xor: 'XOR',
						xnor: 'XNOR',
					},
				),
			],
			[step],
		)

		return <VerbForm step={step} onChange={onChange} inputs={inputs} />
	})

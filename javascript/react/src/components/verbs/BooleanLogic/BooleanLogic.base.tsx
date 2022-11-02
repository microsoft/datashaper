/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@datashaper/schema'
import { BooleanOperator } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../../../types.js'
import type { FormInput } from '../../verbForm/VerbForm.js'
import { VerbForm } from '../../verbForm/VerbForm.js'
import { enumDropdown } from '../../verbForm/VerbFormFactories.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogicBase: React.FC<StepComponentBaseProps<BooleanArgs>> =
	memo(function BooleanLogicBase({ step, onChange }) {
		const inputs = useMemo<FormInput<BooleanArgs>[]>(
			() => [
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
						xnor: 'XNOR',
					},
				),
			],
			[step],
		)

		return <VerbForm step={step} onChange={onChange} inputs={inputs} />
	})

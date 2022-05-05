/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import type { StepComponentBaseProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { VerbForm } from '../../common/VerbForm.js'
import {
	enumDropdown,
	inputColumnList,
} from '../../common/VerbFormFactories.js'

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
				{ required: true },
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

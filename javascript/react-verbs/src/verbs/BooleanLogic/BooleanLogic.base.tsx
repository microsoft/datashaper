/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-hooks'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import { selectColumnListInput } from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '../../types.js'

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
			selectColumnListInput(step, columns),
			{
				label: 'Logical operator',
				type: FormInputType.SingleChoice,
				options: getEnumDropdownOptions(BooleanOperator),
				current: step.args.operator,
				onChange: (s, opt) => (s.args.operator = opt as BooleanOperator),
			},
		],
		[step, columns],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})

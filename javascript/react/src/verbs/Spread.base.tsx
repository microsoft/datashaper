/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Spread step.
 */
export const SpreadBase: React.FC<
	StepComponentBaseProps<SpreadArgs> & {
		columns: string[]
	}
> = memo(function SpreadBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<SpreadArgs>[]>(
		() => [
			inputColumnList(step, columns, 'Columns to spread'),
			{
				label: 'Split delimiter',
				type: FormInputType.Text,
				current: step.args.delimiter,
				onChange: (s, val) => (s.args.delimiter = val as string),
			},
			{
				label: 'Onehot encode values',
				type: FormInputType.Checkbox,
				current: step.args.onehot,
				onChange: (s, val) => (s.args.onehot = val as boolean),
			},
		],
		[step, columns],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

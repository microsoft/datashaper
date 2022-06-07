/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EraseBase: React.FC<
	StepComponentBaseProps<EraseArgs> & { columns: string[] }
> = memo(function EraseBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<EraseArgs>[]>(
		() => [
			inputColumnList(step, columns, 'Columns to erase'),
			{
				label: 'Value to be erased',
				type: FormInputType.Text,
				current: step.args.value,
				placeholder: 'Enter a value',
				required: true,
				onChange: (s, val) => (s.args.value = val),
			},
		],
		[step, columns],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

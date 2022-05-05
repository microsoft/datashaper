/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@data-wrangling-components/core'
import type { StepComponentBaseProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import { inputColumnList } from '../../common/VerbFormFactories.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const ImputeBase: React.FC<
	StepComponentBaseProps<ImputeArgs> & { columns: string[] }
> = memo(function ImputeBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<ImputeArgs>[]>(
		() => [
			inputColumnList(step, columns, 'Columns to Impute'),
			{
				label: 'Fill value',
				type: FormInputType.Text,
				current: step.args.value,
				onChange: (s, val) => (s.args.value = val as string),
			},
		],
		[step, columns],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})

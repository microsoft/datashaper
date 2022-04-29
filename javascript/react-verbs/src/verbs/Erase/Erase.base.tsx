/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@data-wrangling-components/core'
import { useSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.jsx'
import { FormInputType, VerbForm } from '../../common/VerbForm.jsx'
import { selectColumnListInput } from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '../../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EraseBase: React.FC<
	StepComponentBaseProps<EraseArgs> & { columns: string[] }
> = memo(function EraseBase({ step, onChange, columns }) {
	const options = useSimpleDropdownOptions(columns)
	const inputs = useMemo<FormInput<EraseArgs>[]>(
		() => [
			selectColumnListInput(step, columns, 'Columns to erase'),
			{
				label: 'Value to be erased',
				type: FormInputType.Text,
				current: step.args.value,
				placeholder: 'text, number, or boolean',
				onChange: (s, val) => (s.args.value = val),
			},
		],
		[step, options, columns],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

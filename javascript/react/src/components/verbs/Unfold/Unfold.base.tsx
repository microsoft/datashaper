/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { useSimpleDropdownOptions } from '../../../hooks/index.js'
import type { StepComponentBaseProps } from '../../../types.js'
import type { FormInput } from '../../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../../verbForm/VerbForm.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const UnfoldBase: React.FC<
	StepComponentBaseProps<UnfoldArgs> & { columns: string[] }
> = memo(function UnfoldBase({ step, onChange, columns }) {
	const options = useSimpleDropdownOptions(columns)
	const inputs = useMemo<FormInput<UnfoldArgs>[]>(
		() => [
			{
				type: FormInputType.SingleChoice,
				options,
				label: 'Column used as key',
				placeholder: 'Choose column',
				current: step.args.key,
				required: true,
				onChange: (s, val) => (s.args.key = val as string),
			},
			{
				label: 'Column used as value',
				placeholder: 'Choose column',
				type: FormInputType.SingleChoice,
				options,
				current: step.args.value,
				required: true,
				onChange: (s, val) => (s.args.value = val as string),
			},
		],
		[step, options],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

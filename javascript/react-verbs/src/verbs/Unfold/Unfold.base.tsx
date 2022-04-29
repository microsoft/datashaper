/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@data-wrangling-components/core'
import { useSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import type { StepComponentBaseProps } from '../../types.js'

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
				current: step.args.key,
				required: true,
				onChange: (s, val) => (s.args.key = val as string),
			},
			{
				label: 'Column used as value',
				type: FormInputType.SingleChoice,
				options,
				current: step.args.value,
				onChange: (s, val) => (s.args.value = val as string),
			},
		],
		[step, options],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

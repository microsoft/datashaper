/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import type { StepComponentProps } from '../../types.js'
import { FormInput, FormInputType } from '../../common/VerbForm.js'
import { VerbForm } from '../../common/VerbForm.js'

/**
 * Provides inputs for a Fill step.
 */
export const Fill: React.FC<StepComponentProps<FillArgs>> = memo(function Fill({
	step,
	onChange,
}) {
	const inputs = useMemo<FormInput<FillArgs>[]>(
		() => [
			{
				label: 'Fill value',
				placeholder: 'text, number, or boolean',
				type: FormInputType.Text,
				current: step.args.value,
				onChange: (s, val) => (s.args.value = val as string),
			},
		],
		[step],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

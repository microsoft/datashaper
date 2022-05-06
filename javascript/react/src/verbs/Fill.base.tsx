/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '@data-wrangling-components/core'
import type { StepComponentProps } from '../types.js'
import { memo, useMemo } from 'react'

import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'

/**
 * Provides inputs for a Fill step.
 */
export const FillBase: React.FC<StepComponentProps<FillArgs>> = memo(
	function Fill({ step, onChange }) {
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
	},
)

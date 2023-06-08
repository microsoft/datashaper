/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormProps } from '../types.js'

/**
 * Provides inputs for a Fill step.
 */
export const FillFormBase: React.FC<StepFormProps<FillArgs>> = memo(
	function FillFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<FillArgs>[]>(
			() => [
				{
					label: 'Fill value',
					type: FormInputType.Text,
					current: step.args.value,
					onChange: (s, val) => {
						s.args.value = val as string
					},
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

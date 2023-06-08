/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const ImportFormBase: React.FC<StepFormBaseProps<ImputeArgs>> = memo(
	function ImputeFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<ImputeArgs>[]>(
			() => [
				{
					label: 'Fill value',
					placeholder: 'Enter a value',
					type: FormInputType.Text,
					current: step.args.value,
					required: true,
					onChange: (s, val) => {
						s.args.value = val as string
					},
				},
			],
			[step],
		)

		return <VerbForm step={step} onChange={onChange} inputs={inputs} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PrintArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PrintFormBase: React.FC<StepFormBaseProps<PrintArgs>> = memo(
	function PrintFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<PrintArgs>[]>(
			() => [
				{
					label: 'Message to be printed',
					type: FormInputType.Text,
					current: step.args.message,
					placeholder: 'Message content',
					required: false,
					onChange: (s, val) => {
						s.args.message = String(val)
					},
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../../../types.js'
import { type FormInput, FormInputType, VerbForm } from '../verbForm/index.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EraseBase: React.FC<StepComponentBaseProps<EraseArgs>> = memo(
	function EraseBase({ step, onChange }) {
		const inputs = useMemo<FormInput<EraseArgs>[]>(
			() => [
				{
					label: 'Value to be erased',
					type: FormInputType.Text,
					current: step.args.value,
					placeholder: 'Enter a value',
					required: true,
					onChange: (s, val) => (s.args.value = val),
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

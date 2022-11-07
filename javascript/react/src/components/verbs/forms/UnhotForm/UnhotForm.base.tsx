/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const UnhotFormBase: React.FC<StepFormBaseProps<UnhotArgs>> = memo(
	function UnhotFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<UnhotArgs>[]>(
			() => [
				{
					label: 'Keep source columns',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => (s.args.preserveSource = val as boolean),
					advanced: true,
				},
				{
					label: 'Prefix',
					type: FormInputType.Text,
					current: step.args.prefix,
					onChange: (s, val) => (s.args.prefix = val as string),
					advanced: true,
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

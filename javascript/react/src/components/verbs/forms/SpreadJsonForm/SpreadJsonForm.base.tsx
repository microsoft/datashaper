/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadJsonArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const SpreadJsonFormBase: React.FC<StepFormBaseProps<SpreadJsonArgs>> =
	memo(function SpreadJsonFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<SpreadJsonArgs>[]>(
			() => [
				{
					label: 'Json object',
					type: FormInputType.Text,
					current: JSON.stringify(step.args.jsonObject),
					placeholder: 'Enter a valid json',
					required: true,
					onChange: (s, val) => {
						s.args.jsonObject = JSON.parse(String(val))
					},
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	})

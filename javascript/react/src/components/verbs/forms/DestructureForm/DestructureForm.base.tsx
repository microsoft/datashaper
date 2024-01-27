/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const DestructureFormBase: React.FC<StepFormBaseProps<DestructureArgs>> =
	memo(function DestructureFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<DestructureArgs>[]>(
			() => [
				{
					label: 'Keep source column',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => {
						s.args.preserveSource = val as boolean
					},
					advanced: false,
				},
				//TODO: GAUDY ADD KEYS OPTIONAL
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	})

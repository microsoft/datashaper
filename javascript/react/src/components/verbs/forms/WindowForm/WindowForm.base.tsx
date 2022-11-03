/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@datashaper/schema'
import { WindowFunction } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, enumDropdown, VerbForm } from '../forms/index.js'
import type { StepFormProps } from '../types.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const WindowFormBase: React.FC<StepFormProps<WindowArgs>> = memo(
	function WindowFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<WindowArgs>[]>(
			() => [
				enumDropdown(
					'Function',
					WindowFunction,
					step.args.operation,
					(s, val) => (s.args.operation = val as WindowFunction),
					{ required: true, placeholder: 'Choose function' },
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

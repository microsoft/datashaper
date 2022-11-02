/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@datashaper/schema'
import { WindowFunction } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepComponentProps } from '../../../types.js'
import { type FormInput, enumDropdown,VerbForm } from '../../verbForm/index.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const WindowBase: React.FC<StepComponentProps<WindowArgs>> = memo(
	function WindowBase({ step, onChange }) {
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

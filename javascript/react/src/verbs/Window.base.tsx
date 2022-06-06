/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@data-wrangling-components/core'
import { WindowFunction } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepComponentProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import { enumDropdown } from '../verbForm/VerbFormFactories.js'

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
					{required: true}
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

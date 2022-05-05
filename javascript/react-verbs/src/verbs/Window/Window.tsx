/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@data-wrangling-components/core'
import { WindowFunction } from '@data-wrangling-components/core'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { VerbForm } from '../../common/VerbForm.js'
import { enumDropdown } from '../../common/VerbFormFactories.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Window: React.FC<StepComponentProps<WindowArgs>> = memo(
	function Window({ step, onChange }) {
		const inputs = useMemo<FormInput<WindowArgs>[]>(
			() => [
				enumDropdown(
					'Function',
					WindowFunction,
					step.args.operation,
					(s, val) => (s.args.operation = val as WindowFunction),
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@data-wrangling-components/core'
import type { StepComponentProps } from '../types.js'
import { memo, useMemo } from 'react'

import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHotBase: React.FC<StepComponentProps<OnehotArgs>> = memo(
	function OneHotBase({ step, onChange }) {
		const inputs = useMemo<FormInput<OnehotArgs>[]>(
			() => [
				{
					label: 'Prefix',
					type: FormInputType.Text,
					current: step.args.prefix,
					onChange: (s, val) => (s.args.prefix = val as string),
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

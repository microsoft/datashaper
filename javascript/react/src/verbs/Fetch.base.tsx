/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchArgs } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/utilities'
import { memo, useMemo } from 'react'

import type { StepComponentProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'

/**
 * Provides inputs for a Fetch step.
 */
export const FetchBase: React.FC<StepComponentProps<FetchArgs>> = memo(
	function FetchBase({ step, onChange }) {
		const inputs = useMemo<FormInput<FetchArgs>[]>(
			() => [
				{
					label: 'URL',
					type: FormInputType.Text,
					placeholder: 'URL to dataset',
					current: step.args.url,
					required: true,
					onChange: (s, val) => (s.args.url = val as string),
				},
				{
					label: 'Delimiter',
					type: FormInputType.Text,
					placeholder: 'Column delimiter',
					current: step.args.delimiter,
					onChange: (s, val) => (s.args.delimiter = val as string),
				},
				{
					label: 'Automax',
					type: FormInputType.NumberSpinner,
					min: 0,
					max: 10000000,
					step: 1,
					current: step.args.autoMax,
					onChange: (s, val) => (s.args.autoMax = num(val as string)),
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)

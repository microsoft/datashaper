/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchArgs } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/primitives'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import type { StepComponentProps } from '@data-wrangling-components/react-types'

/**
 * Provides inputs for a Fetch step.
 */
export const Fetch: React.FC<StepComponentProps<FetchArgs>> = memo(
	function Fetch({ step, onChange }) {
		const inputs = useMemo<FormInput<FetchArgs>[]>(
			() => [
				{
					label: 'URL',
					type: FormInputType.Text,
					placeholder: 'URL to dataset',
					current: step.args.url,
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

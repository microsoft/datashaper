/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@data-wrangling-components/core'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHot: React.FC<StepComponentProps<OnehotArgs>> = memo(
	function OneHot({ step, onChange }) {
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

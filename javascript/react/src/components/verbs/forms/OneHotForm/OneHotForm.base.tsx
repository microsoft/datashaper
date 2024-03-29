/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import cloneDeep from 'lodash-es/cloneDeep.js'
import { memo, useCallback, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHotFormBase: React.FC<StepFormBaseProps<OnehotArgs>> = memo(
	function OneHotFormBase({ step, onChange }) {
		const prefixInput = useMemo(() => {
			return {
				advanced: true,
				label: `Prefix for column ${step.args.column ?? ''}`,
				type: FormInputType.Text,
				current: step.args.prefix,
				onChange: (s: Step<OnehotArgs>, val: string) => {
					s.args.prefix = val
				},
			}
		}, [step])

		const inputs = useMemo<FormInput<OnehotArgs>[]>(() => {
			return [
				{
					label: 'Keep source columns',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => {
						s.args.preserveSource = val as boolean
					},
					advanced: true,
				},
				prefixInput,
			] as FormInput<OnehotArgs>[]
		}, [step, prefixInput])

		const onStepChange = useCallback(
			(s: Step<OnehotArgs>) => {
				const step = cloneDeep(s)
				onChange?.(step)
			},
			[onChange],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onStepChange} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/primitives'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../../types.js'
import { FormInput, FormInputType, VerbInput } from '../../common/VerbInput.js'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-controls'

/**
 * Provides inputs for a binning step.
 */
export const BinBase: React.FC<StepComponentBaseProps<BinArgs>> = memo(
	function BinBase({ step, onChange }) {
		const verbInputs = useMemo<FormInput<BinArgs>[]>(
			() => [
				{
					label: 'Bin strategy',
					type: FormInputType.SingleChoice,
					options: getEnumDropdownOptions(BinStrategy),
					required: true,
					current: step.args.strategy,
					onChange: (s, opt) => (s.args.strategy = opt as BinStrategy),
					// narrow dropdown style?
				},
				{
					label: 'Bin count',
					type: FormInputType.NumberSpinner,
					condition: step.args.strategy === BinStrategy.FixedCount,
					min: 1,
					max: 100,
					step: 1,
					onChange: (s, opt) => (s.args.fixedcount = num(opt)),
					current: step.args.fixedcount,
				},
				{
					label: 'Bin size',
					type: FormInputType.NumberSpinner,
					condition: step.args.strategy === BinStrategy.FixedWidth,
					min: 1,
					onChange: (s, opt) => (s.args.fixedwidth = num(opt)),
					current: step.args.fixedwidth,
				},
				{
					label: 'Min Boundary',
					type: FormInputType.NumberSpinner,
					condition: step.args.strategy === BinStrategy.Auto,
					onChange: (s, opt) => (s.args.min = num(opt)),
					current: step.args.min,
				},
				{
					label: 'Max Boundary',
					type: FormInputType.NumberSpinner,
					condition: step.args.strategy === BinStrategy.Auto,
					onChange: (s, opt) => (s.args.max = num(opt)),
					current: step.args.max,
				},
				{
					label: 'Clamp to min/max',
					type: FormInputType.Checkbox,
					condition: step.args.strategy === BinStrategy.Auto,
					onChange: (s, opt) => (s.args.clamped = opt),
					current: step.args.clamped,
				},
				{
					label: 'Print range as output',
					type: FormInputType.Checkbox,
					onChange: (s, opt) => (s.args.printRange = opt),
					current: step.args.printRange,
				},
			],
			[step, onChange],
		)
		return <VerbInput onChange={onChange} step={step} inputs={verbInputs} />
	},
)

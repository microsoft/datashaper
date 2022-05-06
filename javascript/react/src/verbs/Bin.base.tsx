/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/utilities'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { checkbox, enumDropdown } from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a binning step.
 */
export const BinBase: React.FC<StepComponentBaseProps<BinArgs>> = memo(
	function BinBase({ step, onChange }) {
		const verbInputs = useMemo<FormInput<BinArgs>[]>(
			() => [
				enumDropdown(
					'Bin strategy',
					BinStrategy,
					step.args.strategy,
					(s, opt) => (s.args.strategy = opt as BinStrategy),
					{ required: true },
				),
				{
					label: 'Bin count',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy === BinStrategy.FixedCount,
					min: 1,
					max: 100,
					step: 1,
					onChange: (s, opt) => (s.args.fixedcount = num(opt as string)),
					current: step.args.fixedcount,
				},
				{
					label: 'Bin size',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy === BinStrategy.FixedWidth,
					min: 1,
					onChange: (s, opt) => (s.args.fixedwidth = num(opt as string)),
					current: step.args.fixedwidth,
				},
				{
					label: 'Min Boundary',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy !== BinStrategy.Auto,
					onChange: (s, opt) => (s.args.min = num(opt as string)),
					current: step.args.min,
				},
				{
					label: 'Max Boundary',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy !== BinStrategy.Auto,
					onChange: (s, opt) => (s.args.max = num(opt as string)),
					current: step.args.max,
				},
				checkbox(
					'Clamp to min/max',
					step.args.clamped,
					(s, val) => (s.args.clamped = val as boolean),
					{ if: step.args.strategy !== BinStrategy.Auto },
				),
				checkbox(
					'Print range as output',
					step.args.printRange,
					(s, opt) => (s.args.printRange = opt as boolean),
				),
			],
			[step],
		)
		return <VerbForm onChange={onChange} step={step} inputs={verbInputs} />
	},
)

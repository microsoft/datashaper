/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'
import { num } from '@datashaper/utilities'
import { memo, useMemo } from 'react'

import {
	type FormInput,
	FormInputType,
	VerbForm,
	checkbox,
	enumDropdown,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Provides inputs for a binning step.
 */
export const BinFormBase: React.FC<StepFormBaseProps<BinArgs>> = memo(
	function BinFormBase({ step, onChange }) {
		const verbInputs = useMemo<FormInput<BinArgs>[]>(
			() => [
				enumDropdown(
					'Bin strategy',
					BinStrategy,
					step.args.strategy,
					(s, opt) => {
						s.args.strategy = opt as BinStrategy
					},
					{ required: true },
				),
				{
					label: 'Bin count',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy === BinStrategy.FixedCount,
					min: 1,
					max: 100,
					step: 1,
					onChange: (s, opt) => {
						s.args.fixedcount = num(opt as string)
					},
					current: step.args.fixedcount,
				},
				{
					label: 'Bin size',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy === BinStrategy.FixedWidth,
					min: 1,
					onChange: (s, opt) => {
						s.args.fixedwidth = num(opt as string)
					},
					current: step.args.fixedwidth,
				},
				{
					label: 'Min Boundary',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy !== BinStrategy.Auto,
					onChange: (s, opt) => {
						s.args.min = num(opt as string)
					},
					current: step.args.min,
					advanced: true,
				},
				{
					label: 'Max Boundary',
					type: FormInputType.NumberSpinner,
					if: step.args.strategy !== BinStrategy.Auto,
					onChange: (s, opt) => {
						s.args.max = num(opt as string)
					},
					current: step.args.max,
					advanced: true,
				},
				checkbox(
					'Clamp to min/max',
					step.args.clamped,
					(s, val) => {
						s.args.clamped = val as boolean
					},
					{
						if: step.args.strategy !== BinStrategy.Auto,
						styles: {
							root: {
								marginTop: 8,
							},
						},
						advanced: true,
					},
				),
				checkbox(
					'Nice rounding',
					step.args.nice,
					(s, val) => {
						s.args.nice = val as boolean
					},
					{
						if:
							step.args.strategy !== BinStrategy.FixedWidth &&
							step.args.strategy !== BinStrategy.FixedCount,
						styles: {
							root: {
								marginTop: 8,
							},
						},
					},
				),
				checkbox(
					'Print range as output',
					step.args.printRange,
					(s, opt) => {
						s.args.printRange = opt as boolean
					},
					{
						styles: {
							root: {
								marginTop: 8,
							},
						},
					},
				),
			],
			[step],
		)

		return <VerbForm onChange={onChange} step={step} inputs={verbInputs} />
	},
)

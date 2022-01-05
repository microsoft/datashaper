/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinStep, BinStrategy } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const BinDescription: React.FC<StepDescriptionProps> = memo(
	function BinDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as BinStep
			const { args } = internal
			return [
				{
					pre: 'binning',
					value: args.field,
				},
				{
					pre: 'with',
					value: args.strategy,
					post: 'strategy',
					sub:
						args.strategy !== BinStrategy.Auto
							? ([
									{
										value:
											args.strategy === BinStrategy.FixedCount
												? args.fixedcount
												: args.fixedwidth,
										post:
											args.strategy === BinStrategy.FixedCount
												? 'bins'
												: 'bin width',
									},
									{
										pre: 'min',
										value: args.min,
									},
									{
										pre: 'max',
										value: args.max,
									},
									{
										value: args.clamped ? 'clamped' : 'not clamped',
									},
							  ] as DescriptionRow[])
							: undefined,
				},
				{
					pre: 'as',
					value: args.as,
				},
			]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

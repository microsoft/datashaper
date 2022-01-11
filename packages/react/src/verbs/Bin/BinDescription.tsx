/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinStep, BinStrategy } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const BinDescription: React.FC<StepDescriptionProps> = memo(
	function BinDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as BinStep
			const { args } = internal
			return [
				{
					before: 'into column',
					value: args.to,
				},
				{
					before: 'using column',
					value: args.field,
					sub: [
						{
							before: 'with',
							value: args.strategy,
							after: 'strategy',
							sub:
								args.strategy &&
								args.strategy !== BinStrategy.Auto &&
								args.strategy
									? [
											{
												value:
													args.strategy === BinStrategy.FixedCount
														? args.fixedcount
														: args.fixedwidth,
												after:
													args.strategy === BinStrategy.FixedCount
														? 'bins'
														: 'bin width',
											},
											{
												before: 'min',
												value: args.min,
											},
											{
												before: 'max',
												value: args.max,
											},
											{
												value: args.clamped ? 'clamped' : 'not clamped',
											},
									  ]
									: undefined,
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

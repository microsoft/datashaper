/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const BinDescription: React.FC<StepDescriptionProps<BinArgs>> = memo(
	function BinDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column',
					value: args.column,
					sub: [
						{
							before: 'using',
							value: args.strategy,
							after: 'strategy',
							sub:
								args.strategy && args.strategy !== BinStrategy.Auto
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
						{
							before: 'output type',
							value: args.printRange ? 'printed range' : 'numeric',
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

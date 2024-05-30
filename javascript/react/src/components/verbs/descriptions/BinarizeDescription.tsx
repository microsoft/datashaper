/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '@datashaper/schema'
import { ComparisonStrategy } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { VerbDescription } from './VerbDescription.js'
import type { StepDescriptionProps } from './types.js'

export const BinarizeDescription: React.FC<StepDescriptionProps<BinarizeArgs>> =
	memo(function BinarizeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'where',
					value: args?.column,
					after: 'row value',
					sub: [
						{
							value: `${args.operator || ''} ${args.value || ''}`,
							after:
								args.strategy === ComparisonStrategy.Column ? 'row value' : '',
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

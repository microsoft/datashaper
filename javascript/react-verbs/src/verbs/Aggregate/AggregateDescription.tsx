/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

export const AggregateDescription: React.FC<
	StepDescriptionProps<AggregateArgs>
> = memo(function AggregateDescription(props) {
	const rows = useMemo(() => {
		const {
			step: { args },
		} = props
		return [
			{
				before: 'group by',
				value: args.groupby,
			},
			{
				before: 'rollup column',
				value: args.column,
				sub: [
					{
						before: 'with function',
						value: args.operation,
					},
				],
			},
		]
	}, [props])
	return <VerbDescription {...props} rows={rows} />
})

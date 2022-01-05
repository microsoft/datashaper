/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AggregateStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../../'
import { StepDescriptionProps } from '../../types'

export const AggregateDescription: React.FC<StepDescriptionProps> = memo(
	function AggregateDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as AggregateStep
			return [
				{
					pre: 'grouping by',
					value: internal.args.groupby,
				},
				{
					pre: 'aggregating',
					value: internal.args.field,
				},
				{
					pre: 'with function',
					value: internal.args.operation,
				},
				{
					pre: 'as',
					value: internal.args.as,
				},
			]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

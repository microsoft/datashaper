/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../'
import type { StepDescriptionProps } from '../../types'

export const PivotDescription: React.FC<StepDescriptionProps> = memo(
	function PivotDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as PivotStep
			const { args } = internal
			return [
				{
					before: 'column to use as key',
					value: args.key,
				},
				{
					before: 'column to use as value',
					value: args.value,
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
	},
)

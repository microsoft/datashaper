/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeStep } from '@data-wrangling-components/core'
import { FilterCompareType } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const BinarizeDescription: React.FC<StepDescriptionProps> = memo(
	function BinarizeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as BinarizeStep
			const { args } = internal
			return [
				{
					before: 'into column',
					value: args?.to,
				},
				{
					before: 'where',
					value: args?.column,
					after: 'row value',
					sub: [
						{
							value: `${args?.operator || ''} ${args?.value || ''}`,
							after: args?.type === FilterCompareType.Column ? 'row value' : '',
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

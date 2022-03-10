/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterStep } from '@data-wrangling-components/core'
import { FilterCompareType } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const FilterDescription: React.FC<StepDescriptionProps> = memo(
	function FilterDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as FilterStep
			const { args } = internal
			return [
				{
					before: 'where',
					value: args.column,
					sub: [
						{
							value: `${args.operator || ''} ${args.value || ''}`,
							after: args.type === FilterCompareType.Column ? 'row value' : '',
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

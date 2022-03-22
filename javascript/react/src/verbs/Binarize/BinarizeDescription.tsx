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
					before: 'where',
					value: args?.column,
					after: 'row value',
					sub: (internal.args.criteria || []).map(criterion => ({
						value: `${criterion.operator || ''} ${criterion.value || ''}`,
						after:
							criterion.type === FilterCompareType.Column ? 'row value' : '',
					})),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

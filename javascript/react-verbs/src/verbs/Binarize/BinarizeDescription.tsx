/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '@data-wrangling-components/core'
import { FilterCompareType } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'

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
					sub: (args.criteria || []).map(criterion => ({
						value: `${criterion.operator || ''} ${criterion.value || ''}`,
						after:
							criterion.type === FilterCompareType.Column ? 'row value' : '',
					})),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

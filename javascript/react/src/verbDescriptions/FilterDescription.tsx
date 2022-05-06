/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '@data-wrangling-components/core'
import { FilterCompareType } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const FilterDescription: React.FC<StepDescriptionProps<FilterArgs>> =
	memo(function FilterDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'where',
					value: args.column,
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '@datashaper/schema'
import { FilterCompareType } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

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
					sub: (args.criteria || EMPTY_ARRAY).map(criterion => ({
						value: `${criterion.operator || ''} ${criterion.value || ''}`,
						after:
							criterion.type === FilterCompareType.Column ? 'row value' : '',
					})),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

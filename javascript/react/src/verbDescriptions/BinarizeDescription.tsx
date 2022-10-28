/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '@datashaper/schema'
import { FilterCompareType } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../empty.js'
import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../../createRowEntries.js'
import { EMPTY_ARRAY } from '../../../empty.js'
import type { StepDescriptionProps } from '../../../types.js'
import { VerbDescription } from './VerbDescription.js'

export const MergeDescription: React.FC<StepDescriptionProps<MergeArgs>> = memo(
	function MergeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns || EMPTY_ARRAY,
				c => ({
					value: c,
				}),
				1,
				props,
			)
			return [
				{
					before: `column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns?.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'with strategy',
					value: args.strategy,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

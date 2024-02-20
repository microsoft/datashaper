/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const DestructureDescription: React.FC<StepDescriptionProps<DestructureArgs>> = memo(
	function DestructureDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.keys || EMPTY_ARRAY,
				(c) => ({
					value: c,
				}),
				1,
				props,
			)
			return [
				{
					before: `key${args.keys?.length !== 1 ? 's' : ''}`,
					value: args.keys?.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'keep source columns',
					value: args.preserveSource ? 'yes' : 'no',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

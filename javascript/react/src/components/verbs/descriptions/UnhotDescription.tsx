/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const UnhotDescription: React.FC<StepDescriptionProps<UnhotArgs>> = memo(
	function UnhotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns || EMPTY_ARRAY,
				(c) => ({
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
					before: 'with prefix',
					value: args.prefix,
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

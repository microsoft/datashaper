/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../../../types.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import { VerbDescription } from './VerbDescription.js'

export const LookupDescription: React.FC<StepDescriptionProps<LookupArgs>> =
	memo(function LookupDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns,
				c => ({
					value: c,
				}),
				3,
				props,
			)
			return [
				{
					before: 'lookup from',
					value: props.step.input[NodeInput.Other]?.node,
				},
				{
					before: 'on',
					value: args.on?.join(' | '),
				},
				{
					before: 'copy columns',
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

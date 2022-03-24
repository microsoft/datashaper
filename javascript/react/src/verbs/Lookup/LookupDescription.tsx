/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupStep } from '@data-wrangling-components/core'
import { NodeInput } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { createRowEntries, VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const LookupDescription: React.FC<StepDescriptionProps> = memo(
	function LookupDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as LookupStep
			const { args } = internal
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
					value: internal.inputs[NodeInput.Other]?.node,
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
	},
)

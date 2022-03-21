/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'
import { createRowEntries } from '../../VerbDescription/util.js'

export const BooleanLogicDescription: React.FC<StepDescriptionProps> = memo(
	function BooleanLogicDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as BooleanStep
			const { args } = internal
			const sub = createRowEntries(
				args.columns || [],
				c => ({
					value: c,
				}),
				1,
				props,
			)
			return [
				{
					before: 'into column',
					value: args.to,
				},
				{
					before: `column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns?.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'with operator',
					value: args.operator,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

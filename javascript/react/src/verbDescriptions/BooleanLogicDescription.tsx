/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '../types.js'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const BooleanLogicDescription: React.FC<
	StepDescriptionProps<BooleanArgs>
> = memo(function BooleanLogicDescription(props) {
	const rows = useMemo(() => {
		const {
			step: { args },
		} = props
		const sub = createRowEntries(
			args.columns || [],
			c => ({
				value: c,
			}),
			3,
			props,
		)
		return [
			{
				before: `combine column${args.columns?.length !== 1 ? 's' : ''}`,
				value: args.columns?.length === 0 ? undefined : '',
				sub,
			},
			{
				before: 'using operator',
				value: args.operator,
			},
		]
	}, [props])
	return <VerbDescription {...props} rows={rows} />
})

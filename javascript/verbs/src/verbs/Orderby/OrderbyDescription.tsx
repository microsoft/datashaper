/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../common/createRowEntries.js'
import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

export const OrderbyDescription: React.FC<StepDescriptionProps> = memo(
	function OrderbyDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as OrderbyStep
			const { args } = internal
			const sub = createRowEntries(
				args.orders || [],
				o => ({
					value: o.column,
					after: o.direction,
				}),
				1,
				props,
			)
			return [
				{
					before: 'order',
					value: args.orders?.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

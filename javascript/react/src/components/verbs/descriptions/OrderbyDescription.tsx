/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const OrderbyDescription: React.FC<StepDescriptionProps<OrderbyArgs>> =
	memo(function OrderbyDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.orders || EMPTY_ARRAY,
				(o) => ({
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
	})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../common/createRowEntries.js'
import { VerbDescription } from '../../common/VerbDescription.js'

export const OrderbyDescription: React.FC<StepDescriptionProps<OrderbyArgs>> =
	memo(function OrderbyDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
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
	})

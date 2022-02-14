/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { OrderbyStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const OrderbyDescription: React.FC<StepDescriptionProps> = memo(
	function OrderbyDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as OrderbyStep
			const { args } = internal
			return [
				...(args.orders || []).map(o => ({
					value: o.column,
					after: o.direction,
				})),
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

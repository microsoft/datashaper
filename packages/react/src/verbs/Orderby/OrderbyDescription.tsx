/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { OrderbyStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const OrderbyDescription: React.FC<StepDescriptionProps> = memo(
	function OrderbyDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as OrderbyStep
			const { args } = internal
			return Object.entries(args.orders).map(o => ({
				value: o[0],
			})) as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

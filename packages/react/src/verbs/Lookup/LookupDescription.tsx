/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LookupStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const LookupDescription: React.FC<StepDescriptionProps> = memo(
	function LookupDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as LookupStep
			return [
				{
					pre: 'from',
					value: internal.args.other,
				},
				{
					pre: 'on',
					value: internal.args.on?.join(' | '),
				},
				{
					pre: 'copy',
					value: internal.args.columns.join(', '),
				},
			]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

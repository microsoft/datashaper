/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JoinStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const JoinDescription: React.FC<StepDescriptionProps> = memo(
	function JoinDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as JoinStep
			return [
				{
					pre: 'with',
					value: internal.args.other,
				},
				{
					pre: 'on',
					value: internal.args.on?.join(' | '),
				},
			]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

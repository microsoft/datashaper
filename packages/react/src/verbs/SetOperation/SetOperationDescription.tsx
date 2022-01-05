/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOperationStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SetOperationDescription: React.FC<StepDescriptionProps> = memo(
	function SetOperationDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as SetOperationStep
			const { args } = internal
			return args.others.map(o => ({ value: o })) as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

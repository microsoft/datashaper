/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GroupbyStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const GroupbyDescription: React.FC<StepDescriptionProps> = memo(
	function GroupbyDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as GroupbyStep
			const { args } = internal
			return [...args.columns.map(c => ({ value: c }))] as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

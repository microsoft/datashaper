/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SelectDescription: React.FC<StepDescriptionProps> = memo(
	function SelectDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as SelectStep
			const { args } = internal
			return Object.keys(args.columns).map(c => ({
				value: c,
			})) as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

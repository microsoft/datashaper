/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RenameStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const RenameDescription: React.FC<StepDescriptionProps> = memo(
	function RenameDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as RenameStep
			const { args } = internal
			return [
				...Object.entries(args.columns).map(c => ({
					value: `${c[0]} -> ${c[1]}`,
				})),
			] as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)

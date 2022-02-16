/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../../'
import type { StepDescriptionProps } from '../../types'

export const FoldDescription: React.FC<StepDescriptionProps> = memo(
	function FoldDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as FoldStep
			const { args } = internal
			return [
				{
					before: 'into key',
					value: args.to !== undefined ? args.to[0] : '',
				},
				{
					before: 'into value',
					value: args.to !== undefined ? args.to[1] : '',
				},
				{
					before: `column${(args.columns || []).length !== 1 ? 's' : ''}`,
					value: args.columns ? args.columns.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

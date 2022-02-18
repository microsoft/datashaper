/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../'
import type { StepDescriptionProps } from '../../types'

export const MergeDescription: React.FC<StepDescriptionProps> = memo(
	function MergeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as MergeStep
			const { args } = internal
			return [
				{
					before: 'into column',
					value: args.to,
				},
				{
					before: 'with strategy',
					value: args.strategy,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOperationStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SetOperationDescription: React.FC<StepDescriptionProps> = memo(
	function SetOperationDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SetOperationStep
			const { args } = internal
			return [
				{
					before: 'with',
					value: args.others.length > 0 ? '' : null,
					sub: args.others.map(o => ({ value: o })) as DescriptionRow[],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

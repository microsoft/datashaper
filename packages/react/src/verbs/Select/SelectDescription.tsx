/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SelectDescription: React.FC<StepDescriptionProps> = memo(
	function SelectDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SelectStep
			const { args } = internal
			return [
				{
					before: `column${(args.columns || []).length !== 1 ? 's' : ''}`,
					value: args.columns ? args.columns.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

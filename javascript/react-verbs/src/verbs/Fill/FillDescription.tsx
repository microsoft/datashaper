/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'

export const FillDescription: React.FC<StepDescriptionProps<FillArgs>> = memo(
	function FillDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'with value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../../../types.js'
import { VerbDescription } from './VerbDescription.js'

export const UnfoldDescription: React.FC<StepDescriptionProps<UnfoldArgs>> =
	memo(function UnfoldDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column to use as key',
					value: args.key,
				},
				{
					before: 'column to use as value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

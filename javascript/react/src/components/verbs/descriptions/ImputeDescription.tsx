/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const ImputeDescription: React.FC<StepDescriptionProps<ImputeArgs>> =
	memo(function ImputeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'impute column',
					value: args.column ?? '',
				},
				{
					before: 'with value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

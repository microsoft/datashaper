/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const EncodeDescription: React.FC<StepDescriptionProps<EncodeArgs>> =
	memo(function EncodeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'apply mapping',
					value: args.applyMapping,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

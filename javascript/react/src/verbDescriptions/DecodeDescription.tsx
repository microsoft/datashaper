/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DecodeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const DecodeDescription: React.FC<StepDescriptionProps<DecodeArgs>> =
	memo(function DecodeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'unapply mapping',
					value: args.unapplyMapping,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

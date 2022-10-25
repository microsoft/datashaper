/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const OneHotDescription: React.FC<StepDescriptionProps<OnehotArgs>> =
	memo(function OneHotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: `onehot column`,
					value: args.column,
				},
				{
					before: `with prefix`,
					value: args.prefix,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})

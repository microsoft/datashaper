/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeDecodeArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { VerbDescription } from './VerbDescription.js'
import type { StepDescriptionProps } from './types.js'

export const EncodeDecodeDescription: React.FC<
	StepDescriptionProps<EncodeDecodeArgs>
> = memo(function EncodeDecodeDescription(props) {
	const rows = useMemo(() => {
		const {
			step: { args },
		} = props
		return [
			{
				before: 'strategy',
				value: args.strategy,
			},
		]
	}, [props])
	return <VerbDescription {...props} rows={rows} />
})

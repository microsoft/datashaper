/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import type { StepDescriptionProps } from '../../types'

export const NoParametersDescription: React.FC<StepDescriptionProps> = memo(
	function NoParametersDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [])
		return <VerbDescription {...props} rows={rows} />
	},
)

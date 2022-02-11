/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../index.js'
import { StepDescriptionProps } from '../../types.js'

export const NoParametersDescription: React.FC<StepDescriptionProps> = memo(
	function NoParametersDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [])
		return <VerbDescription {...props} rows={rows} />
	},
)

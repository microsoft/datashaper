/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const UnorderDescription: React.FC<StepDescriptionProps> = memo(
	function UnorderDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)

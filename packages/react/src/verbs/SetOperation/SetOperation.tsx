/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { TableListInputs } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for any set operation step.
 */
export const SetOperation: React.FC<StepComponentProps> = memo(
	function SetOperation(props) {
		return <TableListInputs {...props} />
	},
)

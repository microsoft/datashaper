/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { TableListInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for any set operation step.
 */
export const SetOperation: React.FC<StepComponentProps> = memo(
	function SetOperation(props) {
		return <TableListInputs {...props} />
	},
)

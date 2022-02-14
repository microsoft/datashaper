/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { ColumnListInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperation: React.FC<StepComponentProps> = memo(
	function ColumnListOperation(props) {
		return <ColumnListInputs {...props} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperation: React.FC<StepComponentProps> = memo(
	function ColumnListOperation(props) {
		return <ColumnListInputs {...props} />
	},
)

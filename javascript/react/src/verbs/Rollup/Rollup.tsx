/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { VerbContainer } from '../../common/index.js'
import { RollupInputs } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a rollup step.
 */
export const Rollup: React.FC<StepComponentProps> = memo(function Rollup(
	props,
) {
	return (
		<VerbContainer>
			<RollupInputs {...props} />
		</VerbContainer>
	)
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { StepComponentProps } from '../../types.js'
import { JoinInputs } from '../shared/index.js'

/**
 * Provides inputs for a Join step.
 * TODO: join and lookup are essentially the same inputs
 * the difference is that lookup requires the copy columns
 * whereas join defaults to copying all
 * however, arquero join does support lookup columns on join,
 * so we could add it as optional inputs
 */
export const Join: React.FC<StepComponentProps> = memo(function Join(props) {
	return <JoinInputs {...props} />
})

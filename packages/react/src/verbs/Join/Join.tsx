/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { JoinInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Join step.
 * TODO: join and lookup are essentially the same inputs
 * the difference is that lookup requires the copy columns
 * whereas join defaults to copying all
 * however, arquero join does support lookup columns on join,
 * so we could add it as optional inputs
 */
export const Join: React.FC<StepComponentProps> = memo(function Join({
	step,
	store,
	onChange,
}) {
	return <JoinInputs step={step} store={store} onChange={onChange} />
})

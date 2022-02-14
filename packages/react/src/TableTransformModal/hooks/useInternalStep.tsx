/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step, Verb, factory } from '@data-wrangling-components/core'
import { useState, useEffect, useCallback } from 'react'

export function useInternalStep(
	step: Step | undefined,
	lastOutput: string | undefined,
	stepsLength: number,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const _step = factory(
				verb,
				lastOutput ?? '',
				`output-${stepsLength + 1}-${verb}`,
			)
			setInternal(_step)
		},
		[lastOutput, stepsLength, setInternal],
	)

	return { internal, handleVerbChange, setInternal }
}

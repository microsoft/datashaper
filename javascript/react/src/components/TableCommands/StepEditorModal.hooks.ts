/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { isInputColumnStep } from '@datashaper/workflow'
import { useMemo } from 'react'

export function useTitle(step: Step | undefined): string {
	return useMemo(() => {
		return step ? step.verb.toUpperCase() : 'New step'
	}, [step])
}

export function useSubTitle(step: Step | undefined): string {
	return useMemo(() => {
		return step && isInputColumnStep(step?.verb)
			? (step?.args as any).column
			: ''
	}, [step])
}

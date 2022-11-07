/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { useMemo } from 'react'

export function useTitle(step: Step | undefined): string {
	return useMemo(() => {
		return step
			? `${step.verb.toUpperCase()} ${
					(step.args as any).column ? `${(step.args as any).column}` : ''
			  }`
			: 'New step'
	}, [step])
}

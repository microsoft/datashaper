/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useHandleSaveClick(
	step: Step | undefined,
	onTransformRequested?: (step: Step) => void,
): (() => void) | undefined {
	const save = useCallback(() => {
		if (step) {
			onTransformRequested?.(step)
		}
	}, [onTransformRequested, step])
	return onTransformRequested ? save : undefined
}

export function useStepOutputHandling(
	workflow: Workflow,
	step: Step | undefined,
): {
	output: string | undefined
	onOutputChanged: (name: string | undefined) => void
} {
	const [output, setOutput] = useState<string>()

	useEffect(
		function useExistingOutputName() {
			if (step?.id && workflow.hasOutputName(step.id)) {
				setOutput(step.id)
			}
		},
		[workflow, step],
	)

	return useMemo(
		() => ({
			output,
			onOutputChanged: setOutput,
		}),
		[output, setOutput],
	)
}

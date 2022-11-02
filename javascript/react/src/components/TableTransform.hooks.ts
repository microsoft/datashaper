/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { Step, Workflow } from '@datashaper/workflow'
import { readStep } from '@datashaper/workflow'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCreateTableId, useFormattedColumnArg } from '../hooks/index.js'

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

export function useInternalTableStep(
	step: Step | undefined,
	workflow: Workflow,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()
	const formattedColumnArg = useFormattedColumnArg()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const createNewTableId = useCreateTableId(workflow)

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const id = createNewTableId(verb)
			const _step = readStep({ verb, id })
			_step.args = formattedColumnArg(_step.args)
			setInternal(_step)
		},
		[setInternal, formattedColumnArg, createNewTableId],
	)

	return { internal, handleVerbChange, setInternal }
}

export function useStepOutputHandling(
	workflow: Workflow,
	step: Step | undefined,
): {
	output: string | undefined
	outputHasChanged: boolean
	onOutputChanged: (name: string | undefined) => void
} {
	const [output, setOutput] = useState<string>()
	const [initialOutput, setInitialOutput] = useState<string>('')
	useEffect(
		function useExistingOutputName() {
			if (step?.id && workflow.hasOutputName(step.id)) {
				setOutput(step.id)
			}
		},
		[workflow, step],
	)

	useEffect(
		function useOutputNameHasChanged() {
			if (output) {
				setInitialOutput(prev => (!prev ? output : prev))
			}
		},
		[output, setInitialOutput],
	)

	return useMemo(
		() => ({
			output,
			outputHasChanged: output !== initialOutput,
			onOutputChanged: setOutput,
		}),
		[output, initialOutput, setOutput],
	)
}

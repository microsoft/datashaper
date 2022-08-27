/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@datashaper/core'
import { readStep } from '@datashaper/core'
import type { Verb } from '@datashaper/schema'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCreateTableId, useFormattedColumnArg } from '../hooks/index.js'

export function useHandleSaveClick(
	step: Step | undefined,
	output: string | undefined,
	onTransformRequested?: (step: Step, outputName: string | undefined) => void,
): () => void {
	return useCallback(() => {
		if (step) {
			onTransformRequested?.(step, output)
		}
	}, [onTransformRequested, step, output])
}

export function useInternalTableStep(
	step: Step | undefined,
	_lastOutput: string | undefined,
	graph: GraphManager,
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

	const createNewTableId = useCreateTableId(graph)

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
	graph: GraphManager,
	step: Step | undefined,
): {
	output: string | undefined
	onOutputChanged: (name: string | undefined) => void
} {
	const [output, setOutput] = useState<string>()

	const stepOutput = graph.outputDefinitions.find(t => t.node === step?.id)
	useEffect(
		function useExistingOutputName() {
			if (stepOutput?.name) {
				setOutput(stepOutput.name)
			}
		},
		[stepOutput],
	)

	return useMemo(
		() => ({
			output,
			onOutputChanged: setOutput,
		}),
		[output, setOutput],
	)
}

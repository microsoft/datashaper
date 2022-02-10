/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { factory, Step, Verb } from '@data-wrangling-components/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	selectStepComponent,
	withTableDropdown,
	withOutputColumnTextfield,
	withInputColumnDropdown,
	withOutputTableTextfield,
	StepComponentProps,
} from '../../'

export function useHandleDismiss(
	onDismiss: (() => void) | undefined,
	setInternal: (step?: Step) => void,
): () => void {
	return useCallback(() => {
		setInternal(undefined)
		onDismiss && onDismiss()
	}, [onDismiss, setInternal])
}

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
			const step = factory(
				verb,
				lastOutput ?? '',
				`output-${stepsLength + 1}-${verb}`,
			)
			setInternal(step)
		},
		[lastOutput, stepsLength, setInternal],
	)

	return { internal, handleVerbChange, setInternal }
}

export function useHandleStepArgs(
	step: Step | undefined,
): React.FC<StepComponentProps> | undefined {
	const Component = useMemo(
		() => (step ? selectStepComponent(step) : null),
		[step],
	)

	const WithAllArgs = useMemo(() => {
		if (Component) {
			return withTableDropdown()(
				withOutputColumnTextfield()(
					withInputColumnDropdown()(withOutputTableTextfield()(Component)),
				),
			)
		}
	}, [Component])

	return WithAllArgs
}

export function useHandleRunClick(
	onDismiss: () => void,
	internal: Step | undefined,
	onTransformRequested?: (internal: Step) => void,
): () => void {
	return useCallback(() => {
		if (internal) {
			onTransformRequested && onTransformRequested(internal)
			onDismiss && onDismiss()
		}
	}, [onDismiss, onTransformRequested, internal])
}

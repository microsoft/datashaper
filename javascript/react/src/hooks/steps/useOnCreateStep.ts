/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { useCallback } from 'react'

/**
 * Get a function to call when a step is created
 * @param save - The save function to call when the step is created
 * @param selectOutput - A function to select the output after the step is created
 * @param dismissModal - The function used to dismill the modal
 * @returns
 */
export function useOnCreateStep(
	save: (step: Step, index: number | undefined) => void,
	selectOutput: undefined | ((name: string) => void),
	dismissModal?: () => void,
): (step: Step, output: string | undefined, index: number | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined, index: number | undefined) => {
			save(step, index)
			dismissModal?.()
			if (output) selectOutput?.(output)
		},
		[save, dismissModal, selectOutput],
	)
}

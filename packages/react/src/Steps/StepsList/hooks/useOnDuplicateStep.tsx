/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnDuplicateStep(
	setStep: (step: Step) => void,
	toggleDuplicatingStep: () => void,
	showTableModal: () => void,
): (_step: Step) => void {
	return useCallback(
		(_step: Step) => {
			toggleDuplicatingStep()
			const dupStep = {
				..._step,
				output: `${_step.output}-dup`,
			}
			setStep(dupStep)
			showTableModal()
		},
		[setStep, showTableModal, toggleDuplicatingStep],
	)
}

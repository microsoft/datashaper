/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import { useState, useCallback, useMemo } from 'react'
import { useOnEditStep, useOnDuplicateStep } from './'

export function useManageSteps(
	showTableModal: () => void,
	toggleDuplicatingStep: () => void,
	isDuplicatingStep: boolean,
	onDismissTableModal: () => void,
	onSave?: (step: Step, index?: number) => void,
): {
	step: Step | undefined
	onDismissClearTableModal: () => void
	onDuplicateClicked: (step: Step) => void
	onEditClicked: (step: Step, index: number) => void
	stepIndex: number | undefined
	modalHeaderText: string
	onCreate: (step: Step, index?: number) => void
} {
	const [step, setStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()

	const onDismissClearTableModal = useCallback(() => {
		onDismissTableModal()
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex, onDismissTableModal])

	const modalHeaderText = useMemo(
		(): any =>
			step ? (isDuplicatingStep ? 'Duplicate Step' : 'Edit step') : 'New step',
		[step, isDuplicatingStep],
	)

	const onEditClicked = useOnEditStep(setStep, setStepIndex, showTableModal)
	const onDuplicateClicked = useOnDuplicateStep(
		setStep,
		toggleDuplicatingStep,
		showTableModal,
	)

	const onCreate = useCallback(
		(_step: Step) => {
			onSave && onSave(_step, stepIndex)
			onDismissClearTableModal()
		},
		[onSave, onDismissClearTableModal, stepIndex],
	)

	return {
		step,
		onDuplicateClicked,
		onDismissClearTableModal,
		onEditClicked,
		stepIndex,
		modalHeaderText,
		onCreate,
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useMemo, useState } from 'react'

export function useManageModal(): {
	hideTableModal: () => void
	toggleDuplicatingStep: () => void
	showTableModal: () => void
	isTableModalOpen: boolean
	isDuplicatingStep: boolean
} {
	const [
		isTableModalOpen,
		{ setTrue: showTableModal, setFalse: hideTableModal },
	] = useBoolean(false)
	const [isDuplicatingStep, { toggle: toggleDuplicatingStep }] =
		useBoolean(false)

	return {
		hideTableModal,
		isTableModalOpen,
		showTableModal,
		isDuplicatingStep,
		toggleDuplicatingStep,
	}
}
export function useManageSteps(
	showTableModal: () => void,
	toggleDuplicatingStep: () => void,
	isDuplicatingStep: boolean,
	onDismissTableModal: () => void,
	onSave?: (step: Step, index?: number) => void,
): {
	step: Step | undefined
	onDismissClearTableModal: () => void
	onDuplicate: (step: Step) => void
	onEdit: (step: Step, index: number) => void
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

	const onEdit = useCallback(
		(_step: Step, index: number) => {
			setStep(_step)
			setStepIndex(index)
			showTableModal()
		},
		[setStep, showTableModal, setStepIndex],
	)

	const onDuplicate = useCallback(
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

	const onCreate = useCallback(
		(_step: Step) => {
			onSave && onSave(_step, stepIndex)
			onDismissClearTableModal()
		},
		[onSave, onDismissClearTableModal, stepIndex],
	)

	return {
		step,
		onDuplicate,
		onDismissClearTableModal,
		onEdit,
		stepIndex,
		modalHeaderText,
		onCreate,
	}
}

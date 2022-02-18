/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import { useState, useCallback } from 'react'
import { useOnDuplicateStep, useOnEditStep } from './index.js'

export function useManageSteps(
	store: TableStore,
	onSave?: (step: Step, index?: number) => void,
): {
	step: Step | undefined
	onDismissClearTableModal: () => void
	onDuplicateClicked: (step: Step) => void
	onEditClicked: (step: Step, index: number) => void
	stepIndex: number | undefined
	onCreate: (step: Step, index?: number) => void
	showTableModal: () => void
	isTableModalOpen: boolean
} {
	const [step, setStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()
	const [
		isTableModalOpen,
		{ setTrue: showTableModal, setFalse: hideTableModal },
	] = useBoolean(false)

	const onDismissClearTableModal = useCallback(() => {
		hideTableModal()
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex, hideTableModal])

	const onEditClicked = useOnEditStep(setStep, setStepIndex, showTableModal)

	const onCreate = useCallback(
		(_step: Step) => {
			onSave && onSave(_step, stepIndex)
			onDismissClearTableModal()
		},
		[onSave, onDismissClearTableModal, stepIndex],
	)
	const onDuplicateClicked = useOnDuplicateStep(store, onSave)

	return {
		step,
		onDuplicateClicked,
		onDismissClearTableModal,
		onEditClicked,
		stepIndex,
		onCreate,
		isTableModalOpen,
		showTableModal,
	}
}

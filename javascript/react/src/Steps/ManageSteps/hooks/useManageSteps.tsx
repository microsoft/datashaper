/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { StepsType } from '../../../index.js'
import { useOnDuplicateStep, useOnEditStep } from './index.js'

export function useManageSteps(
	type: StepsType,
	store?: TableStore,
	table?: ColumnTable,
	onSave?: (step: Step, index?: number) => void,
): {
	step: Step | undefined
	onDismissTransformModal: () => void
	onDuplicateClicked: (step: Step) => void
	onEditClicked: (step: Step, index: number) => void
	onCreate: (step: Step, index?: number) => void
	onStartNewStep: () => void
	isTransformModalOpen: boolean
	addStepButtonId: string
	editorTarget?: string
} {
	const [step, setStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()

	const [
		isTransformModalOpen,
		{ setTrue: showTransformModal, setFalse: hideTransformModal },
	] = useBoolean(false)

	const onDismissTransformModal = useCallback(() => {
		hideTransformModal()
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex, hideTransformModal])

	const onEditClicked = useOnEditStep(setStep, setStepIndex, showTransformModal)

	const onCreate = useCallback(
		(_step: Step) => {
			onSave?.(_step, stepIndex)
			onDismissTransformModal()
		},
		[onSave, onDismissTransformModal, stepIndex],
	)
	const onDuplicateClicked = useOnDuplicateStep(type, store, table, onSave)

	const addStepButtonId = useMemo(
		() => `button-${Math.round(Math.random() * 3)}`,
		[],
	)

	const [editorTarget, setEditorTarget] = useState<string>(addStepButtonId)
	useEffect(() => {
		if (stepIndex !== undefined) {
			setEditorTarget(`.step-card-${stepIndex}`)
		} else {
			setEditorTarget(`#${addStepButtonId}`)
		}
	}, [addStepButtonId, stepIndex])

	const onStartNewStep = useCallback(() => {
		showTransformModal()
	}, [showTransformModal])

	return {
		step,
		onDuplicateClicked,
		onDismissTransformModal,
		onEditClicked,
		onCreate,
		isTransformModalOpen,
		onStartNewStep,
		addStepButtonId,
		editorTarget,
	}
}

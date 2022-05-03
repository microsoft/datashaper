// /*!
//  * Copyright (c) Microsoft. All rights reserved.
//  * Licensed under the MIT license. See LICENSE file in the project.
//  */

// import type { Step, GraphManager } from '@data-wrangling-components/core'
// import { useBoolean, useStaticValue } from '@fluentui/react-hooks'
// import type ColumnTable from 'arquero/dist/types/table/column-table'
// import { useCallback, useEffect, useMemo, useState } from 'react'

// import type { StepsType } from '../../../index.js'
// import { useOnDuplicateStep, useOnEditStep } from './index.js'

// export function useManageSteps(
// 	type: StepsType,
// 	graph: GraphManager,
// 	table?: ColumnTable,
// 	onSave?: (step: Step, index?: number) => void,
// ): {
// 	/**
// 	 * The step currently being edited
// 	 */
// 	selectedStep: Step | undefined

// 	/**
// 	 * Callback to dismiss the transform modal
// 	 */
// 	onDismissTransformModal: () => void
// 	onDuplicateClicked: (step: Step) => void
// 	onEditClicked: (step: Step, index: number) => void
// 	onCreate: (step: Step, index?: number) => void
// 	onStartNewStep: () => void
// 	isTransformModalOpen: boolean
// 	addStepButtonId: string
// 	editorTarget?: string
// } {
// 	const [selectedStep, setSelectedStep] = useState<Step | undefined>()
// 	const [selectedStepIndex, setSelectedStepIndex] = useState<number>()

// 	const {
// 		isOpen: isTransformModalOpen,
// 		dismiss: onDismissTransformModal,
// 		show: showTransformModal,
// 	} = useTransformModalState(setSelectedStep, setSelectedStepIndex)

// 	const onEditClicked = useOnEditStep(
// 		setSelectedStep,
// 		setSelectedStepIndex,
// 		showTransformModal,
// 	)

// 	const onCreate = useCallback(
// 		(_step: Step) => {
// 			onSave?.(_step, selectedStepIndex)
// 			onDismissTransformModal()
// 		},
// 		[onSave, onDismissTransformModal, selectedStepIndex],
// 	)
// 	const onDuplicateClicked = useOnDuplicateStep(type, graph, table, onSave)
// 	const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)

// 	return {
// 		selectedStep,
// 		isTransformModalOpen,
// 		addStepButtonId,
// 		editorTarget,
// 		onDuplicateClicked,
// 		onDismissTransformModal,
// 		onEditClicked,
// 		oCnreate,
// 		onStartNewStep: showTransformModal,
// 	}
// }

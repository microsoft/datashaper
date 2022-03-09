/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useState, useCallback, useMemo, useEffect } from 'react'
import type { StepsType} from '../../../index.js';
import { useTables } from '../../../index.js'
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
	showTransformModal: () => void
	isTansformModalOpen: boolean
	tables: TableContainer[]
} {
	const [step, setStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()
	const tables = useTables(store)

	const [
		isTansformModalOpen,
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
			onSave && onSave(_step, stepIndex)
			onDismissTransformModal()
		},
		[onSave, onDismissTransformModal, stepIndex],
	)
	const onDuplicateClicked = useOnDuplicateStep(type, store, table, onSave)

	return {
		step,
		onDuplicateClicked,
		onDismissTransformModal,
		onEditClicked,
		onCreate,
		isTansformModalOpen,
		showTransformModal,
		tables,
	}
}

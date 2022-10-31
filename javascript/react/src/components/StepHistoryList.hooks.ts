/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useCallback, useState } from 'react'

import { DisplayOrder } from '../enums.js'
import { useModalState } from '../hooks/useModalState.js'

export function useTableHandlers(
	workflow: Workflow,
	steps: Step[],
	order: DisplayOrder | undefined,
	onSelect?: (name: string) => void,
): {
	onSelectOriginalTable: () => void
	onSelectLatest: () => void
} {
	order = order ?? DisplayOrder.FirstOnTop

	const onSelectOriginalTable = useCallback(() => {
		if (workflow.inputNames.length > 0) {
			const names = workflow.inputNames
			const lastInputName = names[names.length - 1]
			if (lastInputName) {
				onSelect?.(lastInputName)
			}
		}
	}, [workflow, onSelect])
	const onSelectLatest = useCallback(() => {
		const lastStepIdx = order === DisplayOrder.FirstOnTop ? steps.length - 1 : 0
		const latestId = steps[lastStepIdx]?.id
		latestId && onSelect?.(latestId)
	}, [onSelect, steps, order])
	return {
		onSelectOriginalTable,
		onSelectLatest,
	}
}

/* eslint-disable @typescript-eslint/unbound-method */
export function useDeleteConfirm(onDelete?: (index: number) => void): {
	isOpen: boolean
	toggle: () => void
	onClick?: (index: number) => void
	onConfirm: () => void
} {
	const { isOpen, show, hide, toggle } = useModalState(undefined, undefined)
	const [deleteIndex, setDeleteIndex] = useState<number>()

	const onDeleteClicked = useCallback(
		(index: number) => {
			setDeleteIndex(index)
			show()
		},
		[show, setDeleteIndex],
	)

	const onConfirmDelete = useCallback(() => {
		deleteIndex != null && deleteIndex >= 0 && onDelete?.(deleteIndex)
		hide()
	}, [hide, deleteIndex, onDelete])

	return {
		isOpen,
		toggle,
		onConfirm: onConfirmDelete,
		onClick: onDelete ? onDeleteClicked : undefined,
	}
}

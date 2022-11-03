/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useCallback, useState } from 'react'

import { useModalState } from '../../hooks/fluent/useModalState.js'

export function useTableHandlers(
	workflow: Workflow,
	onSelect?: (name: string) => void,
): {
	onSelectOriginalTable: () => void
	onSelectLatest: () => void
} {
	const onSelectOriginalTable = useCallback(() => {
		if (workflow.inputNames.length > 0) {
			// select the first input table
			onSelect?.(workflow.inputNames[0]!)
		}
	}, [workflow, onSelect])
	const onSelectLatest = useCallback(() => {
		const steps = workflow.steps
		const latestId = steps[steps.length - 1]!.id
		onSelect?.(latestId)
	}, [onSelect, workflow])

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

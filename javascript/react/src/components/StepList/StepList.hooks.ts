/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

import { useModalState } from '../../hooks/fluent/useModalState.js'

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

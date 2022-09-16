/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import { useCallback, useEffect, useState } from 'react'

import { useModalState, useStaticValue } from '../hooks/index.js'

export function useEditorTarget(stepIndex: number | undefined): {
	editorTarget: string
	addStepButtonId: string
} {
	const addStepButtonId = useStaticValue(
		`button-${Math.round(Math.random() * 3)}`,
	)
	const [editorTarget, setEditorTarget] = useState<string>(addStepButtonId)
	useEffect(() => {
		if (stepIndex !== undefined) {
			setEditorTarget(`.step-card-${stepIndex}`)
		} else {
			setEditorTarget(`#${addStepButtonId}`)
		}
	}, [addStepButtonId, stepIndex])

	return {
		editorTarget,
		addStepButtonId,
	}
}

export function useDeleteConfirm(onDelete?: (args: any) => void): {
	isOpen: boolean
	toggle: () => void
	onClick: (args: any) => void
	onConfirm: () => void
} {
	const { isOpen, show, hide, toggle } = useModalState(undefined, undefined)
	const [deleteArg, setDeleteArg] = useState<any>()

	const onDeleteClicked = useCallback(
		(args: any) => {
			setDeleteArg(args)
			show()
		},
		[show, setDeleteArg],
	)

	const onConfirmDelete = useCallback(() => {
		onDelete?.(deleteArg)
		hide()
	}, [hide, deleteArg, onDelete])

	return {
		isOpen,
		toggle,
		onConfirm: onConfirmDelete,
		onClick: onDeleteClicked,
	}
}

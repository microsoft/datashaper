/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/core'
import type { IButtonProps } from '@fluentui/react'
import { useMemo } from 'react'

export function useStepActions(
	step: Step,
	index: number,
	onEdit?: (step: Step, index: number) => void,
	onDelete?: (index: number) => void,
	onDuplicate?: (step: Step) => void,
	onSelect?: (name: string) => void,
): IButtonProps[] {
	return useMemo(() => {
		const actionsList = []
		if (onSelect) {
			actionsList.push({
				iconProps: iconProps.preview,
				onClick: () => onSelect(step?.id),
				title: 'Preview table',
			})
		}
		if (onEdit) {
			actionsList.push({
				iconProps: iconProps.edit,
				onClick: () => onEdit(step, index),
				title: 'Edit step',
			})
		}
		if (onDuplicate) {
			actionsList.push({
				iconProps: iconProps.duplicate,
				onClick: () => onDuplicate(step),
				title: 'Duplicate step',
			})
		}
		if (onDelete) {
			actionsList.push({
				iconProps: iconProps.delete,
				onClick: () => onDelete?.(index),
				title: 'Delete step',
			})
		}
		return actionsList
	}, [step, index, onEdit, onDelete, onDuplicate, onSelect])
}

const iconProps = {
	preview: { iconName: 'View' },
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

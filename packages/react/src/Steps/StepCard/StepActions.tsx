/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
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
		return [
			{
				iconProps: iconProps.preview,
				onClick: () => onSelect && onSelect(step?.output),
				ariaLabel: 'preview table',
			},
			{
				iconProps: iconProps.edit,
				onClick: () => onEdit && onEdit(step, index),
				ariaLabel: 'edit step',
			},
			{
				iconProps: iconProps.duplicate,
				onClick: () => onDuplicate && onDuplicate(step),
				ariaLabel: 'duplicate step',
			},
			{
				iconProps: iconProps.delete,
				onClick: () => onDelete && onDelete(index),
				ariaLabel: 'delete step',
			},
		] as IButtonProps[]
	}, [step, index, onEdit, onDelete, onDuplicate, onSelect])
}

const iconProps = {
	preview: { iconName: 'RedEye' },
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

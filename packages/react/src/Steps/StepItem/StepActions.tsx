/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { IButtonStyles, IconButton, TooltipHost } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

export function useStepActions(
	step: Step,
	index: number,
	onEdit?: (step: Step, index: number) => void,
	onDelete?: (index: number) => void,
	onDuplicate?: (step: Step) => void,
	onSelect?: (name: string) => void,
) {
	return useMemo(
		() => (
			<StepActions
				onEdit={() => onEdit && onEdit(step, index)}
				onDelete={() => onDelete && onDelete(index)}
				onDuplicate={() => onDuplicate && onDuplicate(step)}
				onSelect={() => onSelect && onSelect(step?.output)}
			/>
		),
		[step, index, onEdit, onDelete, onDuplicate, onSelect],
	)
}

export const StepActions: React.FC<{
	onEdit?: () => void
	onDelete?: () => void
	onDuplicate?: () => void
	onSelect?: () => void
}> = memo(function StepActions({ onEdit, onDelete, onDuplicate, onSelect }) {
	return (
		<Container>
			{onSelect && (
				<TooltipHost content="Preview table" setAriaDescribedBy={false}>
					<IconButton
						styles={iconButtonStyle}
						onClick={onSelect}
						iconProps={iconProps.preview}
						aria-label="Preview"
					/>
				</TooltipHost>
			)}
			{onEdit && (
				<TooltipHost content="Edit step" setAriaDescribedBy={false}>
					<IconButton
						styles={iconButtonStyle}
						onClick={onEdit}
						iconProps={iconProps.edit}
						aria-label="Edit"
					/>
				</TooltipHost>
			)}
			{onDuplicate && (
				<TooltipHost content="Duplicate step" setAriaDescribedBy={false}>
					<IconButton
						styles={iconButtonStyle}
						onClick={onDuplicate}
						iconProps={iconProps.duplicate}
						aria-label="Duplicate"
					/>
				</TooltipHost>
			)}
			{onDelete && (
				<TooltipHost content="Delete step" setAriaDescribedBy={false}>
					<IconButton
						styles={iconButtonStyle}
						onClick={onDelete}
						iconProps={iconProps.delete}
						aria-label="Delete"
					/>
				</TooltipHost>
			)}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
`

const iconProps = {
	preview: { iconName: 'RedEye' },
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

const iconButtonStyle: IButtonStyles = {
	icon: {
		fontSize: '16px',
	},
	root: {
		verticalAlign: 'super',
	},
}

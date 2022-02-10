/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IButtonStyles, IconButton, TooltipHost } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

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

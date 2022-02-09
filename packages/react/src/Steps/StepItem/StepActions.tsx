/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IButtonStyles, IconButton } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

export const StepActions: React.FC<{
	onEdit?: () => void
	onDelete?: () => void
	onDuplicate?: () => void
}> = memo(function StepActions({ onEdit, onDelete, onDuplicate }) {
	return (
		<Container>
			{onEdit && (
				<IconButton
					styles={iconButtonStyle}
					onClick={onEdit}
					iconProps={iconProps.edit}
					aria-label="Edit"
				/>
			)}
			{onEdit && (
				<IconButton
					styles={iconButtonStyle}
					onClick={onEdit}
					iconProps={iconProps.edit}
					aria-label="Edit"
				/>
			)}
			{onDuplicate && (
				<IconButton
					styles={iconButtonStyle}
					onClick={onDuplicate}
					iconProps={iconProps.duplicate}
					aria-label="Duplicate"
				/>
			)}
			{onDelete && (
				<IconButton
					styles={iconButtonStyle}
					onClick={onDelete}
					iconProps={iconProps.delete}
					aria-label="Delete"
				/>
			)}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
`

const iconProps = {
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

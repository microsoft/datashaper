/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { IconButton } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { selectStepDescription } from '../../selectStepDescription'

export const StepActions: React.FC<{
	step: Step
	onEdit: () => void
	onDelete: () => void
}> = memo(function StepActions({ step, onEdit, onDelete }) {
	const Description = useMemo(() => selectStepDescription(step), [step])

	const Actions = useMemo((): any => {
		return (
			<div>
				<IconButton
					styles={{
						icon: {
							fontSize: '16px',
						},
						root: {
							verticalAlign: 'super',
						},
					}}
					onClick={onEdit}
					iconProps={iconProps.edit}
					aria-label="Edit"
				/>
				<IconButton
					styles={{
						icon: {
							fontSize: '16px',
						},
						root: {
							verticalAlign: 'super',
						},
					}}
					onClick={onDelete}
					iconProps={iconProps.delete}
					aria-label="Delete"
				/>
			</div>
		)
	}, [])

	return (
		<Container>
			<Description actions={Actions} step={step} showInput showOutput />
		</Container>
	)
})

const Container = styled.div`
	padding: 4px 14px 8px 14px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	margin: 8px;
	border: 1px solid #c5c5c5;
`

const iconProps = {
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

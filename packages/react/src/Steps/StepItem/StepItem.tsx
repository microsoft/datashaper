/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { selectStepDescription } from '../../selectStepDescription.js'
import { useStepActions } from './StepActions.js'

export const StepItem: React.FC<{
	step: Step
	index: number
	onEdit?: (step: Step, index: number) => void
	onDelete?: (index: number) => void
	onDuplicate?: (step: Step) => void
	onSelect?: (name: string) => void
}> = memo(function StepItem({
	step,
	index,
	onEdit,
	onDelete,
	onDuplicate,
	onSelect,
}) {
	const Description = useMemo(() => selectStepDescription(step), [step])
	const Actions = useStepActions(
		step,
		index,
		onEdit,
		onDelete,
		onDuplicate,
		onSelect,
	)

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
	height: 80%;
`

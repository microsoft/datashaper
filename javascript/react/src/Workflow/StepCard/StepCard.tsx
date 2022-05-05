/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { DocumentCard, DocumentCardActions } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { selectStepDescription } from '@data-wrangling-components/react-verbs'
import { useStepActions } from './StepActions.js'

export const StepCard: React.FC<{
	step: Step
	index: number
	onEdit?: (step: Step, index: number) => void
	onDelete?: (index: number) => void
	onDuplicate?: (step: Step) => void
	onSelect?: (name: string) => void
}> = memo(function StepCard({
	step,
	index,
	onEdit,
	onDelete,
	onDuplicate,
	onSelect,
}) {
	const Description = useMemo(() => selectStepDescription(step), [step])
	const stepActions = useStepActions(
		step,
		index,
		onEdit,
		onDelete,
		onDuplicate,
		onSelect,
	)

	return (
		<Card styles={styles.card}>
			<CardContent>
				<Description step={step} showInput showOutput showOutputColumn />
			</CardContent>
			<DocumentCardActions
				className={`step-card-${index}`}
				styles={styles.actions}
				actions={stepActions}
			/>
		</Card>
	)
})

const styles = {
	card: {
		root: {
			minWidth: 'unset',
		},
	},
	actions: { root: { padding: 'unset' } },
}

const CardContent = styled.div`
	padding: 8px;
`

const Card = styled(DocumentCard)`
	min-width: fit-content;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

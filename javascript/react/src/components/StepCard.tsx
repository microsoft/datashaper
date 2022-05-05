/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { selectStepDescription } from '@data-wrangling-components/react-verbs'
import { DocumentCardActions } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { useStepActions } from './StepCard.hooks.js'
import type { StepCardProps } from './StepCard.types.js'
import { styles, CardContent, Card } from './StepCard.styles.js'

export const StepCard: React.FC<StepCardProps> = memo(function StepCard({
	step,
	index,
	output,
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
				<Description
					step={step}
					output={output}
					showInput
					showOutput
					showOutputColumn
				/>
			</CardContent>
			<DocumentCardActions
				className={`step-card-${index}`}
				styles={styles.actions}
				actions={stepActions}
			/>
		</Card>
	)
})

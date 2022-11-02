/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentCardActions } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { memo, useMemo } from 'react'

import { selectStepDescription } from '../StepDescription/selectStepDescription.js'
import { useStepActions } from './StepCard.hooks.js'
import { Card, CardContent, styles } from './StepCard.styles.js'
import type { StepCardProps } from './StepCard.types.js'

export const StepCard: React.FC<StepCardProps> = memo(function StepCard({
	step,
	index,
	output,
	onEdit,
	onDelete,
	onDuplicate,
	onSelect,
	style = {
		card: {},
		actions: {},
	},
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
		<Card styles={merge({}, styles.card, style.card)}>
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
				styles={merge({}, styles.actions, style.actions)}
				actions={stepActions}
			/>
		</Card>
	)
})

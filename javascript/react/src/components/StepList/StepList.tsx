/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo, useEffect, useRef } from 'react'

import { StepCard } from '../../index.js'
import { DetailText } from './DetailText.js'
import {
	addButtonStyles,
	ButtonContainer,
	Container,
	icons,
} from './StepList.styles.js'
import type { StepListProps } from './StepList.types.js'

export const StepList: React.FC<StepListProps> = memo(function StepsList({
	steps,
	outputs,
	onDeleteClicked,
	onEditClicked,
	onDuplicateClicked,
	onSelect,
	onStartNewStep,
	buttonId,
}) {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const f = () => {
			ref?.current?.scrollIntoView(false)
		}
		f()
	}, [steps])

	return (
		<Container>
			{steps.map((step, index) => (
				<StepCard
					output={outputs[index]}
					onDelete={onDeleteClicked}
					onEdit={onEditClicked}
					onDuplicate={onDuplicateClicked}
					onSelect={onSelect}
					key={step.id}
					step={step}
					index={index}
				/>
			))}

			{onStartNewStep && (
				<ButtonContainer ref={ref}>
					<DefaultButton
						styles={addButtonStyles}
						iconProps={icons.add}
						onClick={onStartNewStep}
						id={buttonId}
					>
						Add step
					</DefaultButton>
					{!steps?.length && (
						<DetailText text="Add your first preparation step" />
					)}
				</ButtonContainer>
			)}
		</Container>
	)
})

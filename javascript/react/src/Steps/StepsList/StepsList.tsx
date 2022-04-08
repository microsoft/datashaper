/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { StepCard } from '../../index.js'
import { DetailText } from '../../PrepareData/DetailText/index.js'

export const StepsList: React.FC<{
	steps?: Step[]
	onDeleteClicked?: (index: number) => void
	onEditClicked?: (step: Step, index: number) => void
	onDuplicateClicked?: (step: Step) => void
	onSelect?: (name: string) => void
	onStartNewStep?: () => void
	buttonId?: string
}> = memo(function StepsList({
	steps,
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
			ref?.current?.scrollIntoView()
		}
		f()
	}, [steps])

	return (
		<Container>
			{steps?.map((_step, index) => {
				return (
					<StepCard
						onDelete={onDeleteClicked}
						onEdit={onEditClicked}
						onDuplicate={onDuplicateClicked}
						onSelect={onSelect}
						key={index}
						step={_step}
						index={index}
					/>
				)
			})}

			{onStartNewStep && (
				<ButtonContainer ref={ref}>
					<DefaultButton
						styles={addButtonStyles}
						iconProps={iconProps.add}
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

const addButtonStyles = {
	root: { padding: '0 4px 0 6px', whiteSpace: 'nowrap' },
}

const iconProps = {
	add: { iconName: 'Add' },
}

const Container = styled.div`
	display: flex;
	overflow: auto;
	column-gap: 12px;
`

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
`

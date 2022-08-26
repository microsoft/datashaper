/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { useThematic } from '@thematic/react'
import type { Step } from '@datashaper/core'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { DefaultButton, Panel } from '@fluentui/react'
import { memo, useEffect, useRef } from 'react'

import { StepCard } from '../index.js'
import {
	addButtonStyles,
	ButtonContainer,
	Container,
	icons,
	PanelHeader,
	panelStyles,
	Verb,
} from './StepHistoryPanel.styles.js'
import type { StepHistoryPanelProps } from './StepHistoryPanel.types.js'

export const StepHistoryPanel: React.FC<StepHistoryPanelProps> = memo(
	function StepsList({
		panelIsOpen,
		onDismissPanel,
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
		// const theme = useThematic()

		useEffect(() => {
			const f = () => {
				ref?.current?.scrollIntoView(false)
			}
			f()
		}, [steps])

		return (
			<Panel
				headerText={`History (${steps.length})`}
				isOpen={panelIsOpen}
				onDismiss={onDismissPanel}
				closeButtonAriaLabel="Close"
				styles={panelStyles}
			>
				<Container>
					<CollapsiblePanelContainer>
						{steps.map((step, index) => {
							return (
								<CollapsiblePanel
									onRenderHeader={() => onRenderHeader(step, outputs[index])}
									// headerStyle={{
									// 	backgroundColor: theme.application().lowContrast().hex(),
									// 	color: 'theme.application().highContrast().hex()
									// }}
									key={index}
								>
									<StepCard
										output={outputs[index]}
										onDelete={onDeleteClicked}
										onEdit={onEditClicked}
										onDuplicate={onDuplicateClicked}
										onSelect={onSelect}
										key={index}
										step={step}
										index={index}
									/>
								</CollapsiblePanel>
							)
						})}
					</CollapsiblePanelContainer>

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
						</ButtonContainer>
					)}
				</Container>
			</Panel>
		)
	},
)

function onRenderHeader(step: Step, output?: string): JSX.Element {
	return (
		<PanelHeader>
			<Verb>{step.verb}</Verb>
			{output}
		</PanelHeader>
	)
}

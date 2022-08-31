/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/core'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { DefaultButton, Panel } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { capitalize } from 'lodash-es'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { StepCard } from '../index.js'
import { useHeaderStyle, usePanelStyle } from './StepHistoryPanel.hooks.js'
import {
	addButtonStyles,
	ButtonContainer,
	Container,
	icons,
	PanelHeader,
	stepCardStyle,
	tableTransformStyle,
	Verb,
} from './StepHistoryPanel.styles.js'
import type { StepHistoryPanelProps } from './StepHistoryPanel.types.js'
import { TableTransform } from './TableTransform.js'

export const StepHistoryPanel: React.FC<StepHistoryPanelProps> = memo(
	function StepsList({
		panelIsOpen,
		onDismissPanel,
		steps,
		outputs,
		onDeleteClicked,
		onDuplicateClicked,
		onSelect,
		onStartNewStep,
		buttonId,
		graph,
		onCreate,
		nextInputTable,
	}) {
		const ref = useRef<HTMLDivElement>(null)
		const [editStep, setEditStep] = useState<Step | undefined>()
		const [showEdit, { setTrue: setShowEdit, setFalse: setHideEdit }] =
			useBoolean(false)
		const headerStyle = useHeaderStyle()
		const panelStyle = usePanelStyle()

		const onEdit = useCallback(
			(step: Step) => {
				setShowEdit()
				setEditStep(step)
			},
			[setEditStep, setShowEdit],
		)

		const onCancelEdit = useCallback(() => {
			setHideEdit()
			setEditStep(undefined)
		}, [setHideEdit, setEditStep])

		const onTransformRequested = useCallback(
			(step: Step, output: string | undefined, index?: number) => {
				onCancelEdit()
				onCreate?.(step, output, index)
			},
			[onCancelEdit, onCreate],
		)

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
				styles={panelStyle}
			>
				<Container>
					<CollapsiblePanelContainer>
						{steps.map((step, index) => {
							return (
								<CollapsiblePanel
									key={index}
									headerStyle={headerStyle}
									onRenderHeader={() => onRenderHeader(step, outputs[index])}
								>
									{editStep?.id === step.id && showEdit ? (
										<TableTransform
											key={index}
											step={step}
											index={index}
											graph={graph}
											style={tableTransformStyle}
											nextInputTable={nextInputTable}
											onCancel={onCancelEdit}
											onTransformRequested={(s, o) =>
												onTransformRequested(s, o, index)
											}
										/>
									) : (
										<StepCard
											key={index}
											step={step}
											index={index}
											output={outputs[index]}
											style={stepCardStyle}
											onDelete={onDeleteClicked}
											onEdit={() => onEdit(step)}
											onDuplicate={onDuplicateClicked}
											onSelect={onSelect}
										/>
									)}
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
			{capitalize(output)}
		</PanelHeader>
	)
}

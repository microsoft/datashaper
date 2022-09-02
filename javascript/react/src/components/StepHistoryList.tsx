/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { DefaultButton } from '@fluentui/react'
import { capitalize } from 'lodash-es'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { useHeaderStyle } from './StepHistoryList.hooks.js'
import {
	addButtonStyles,
	ButtonContainer,
	Columns,
	Container,
	icons,
	ListWrapper,
	PanelHeader,
	tableTransformStyle,
	Verb,
} from './StepHistoryList.styles.js'
import type { StepHistoryListProps } from './StepHistoryList.types.js'
import { TableTransform } from './TableTransform.js'

export const StepHistoryList: React.FC<StepHistoryListProps> = memo(
	function StepsList({
		steps,
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
		const headerStyle = useHeaderStyle()
		const [isExpanded, setIsExpanded] = useState<number[]>([])
		const onHeaderClick = useCallback(
			(state: boolean, index: number) => {
				setIsExpanded(prev =>
					state ? [...prev, index] : prev.filter(i => i !== index),
				)
			},
			[setIsExpanded],
		)

		const onTransformRequested = useCallback(
			(step: Step, output: string | undefined, index?: number) => {
				onCreate?.(step, output, index)
			},
			[onCreate],
		)

		useEffect(() => {
			const f = () => {
				ref?.current?.scrollIntoView(false)
			}
			f()
		}, [steps])

		return (
			<Container>
				<CollapsiblePanelContainer>
					{steps.map((step, index) => {
						return (
							<CollapsiblePanel
								key={index}
								onHeaderClick={s => onHeaderClick(s, index)}
								headerStyle={headerStyle(!!isExpanded?.includes(index))}
								onRenderHeader={() => onRenderHeader(step)}
							>
								<ListWrapper>
									<TableTransform
										key={index}
										step={step}
										index={index}
										graph={graph}
										isEditing={true}
										style={tableTransformStyle}
										nextInputTable={nextInputTable}
										onDelete={onDeleteClicked}
										onPreview={onSelect}
										onDuplicate={onDuplicateClicked}
										onTransformRequested={(s, o) =>
											onTransformRequested(s, o, index)
										}
									/>
								</ListWrapper>
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
		)
	},
)

function onRenderHeader(step: Step): JSX.Element {
	const { args } = step
	const columns: string[] = (args as any).columns ||
		(args as any).on || [(args as any).column]
	return (
		<PanelHeader>
			<Verb>{step.verb}</Verb>
			<Columns>{capitalize(columns?.join(', '))}</Columns>
		</PanelHeader>
	)
}

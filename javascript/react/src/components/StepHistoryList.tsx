/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
	DialogConfirm,
} from '@essex/components'
import { DefaultButton, useTheme } from '@fluentui/react'
import debug from 'debug'
import { memo, useCallback, useEffect, useRef } from 'react'

import { useWorkflowSteps } from '../hooks/useWorkflowSteps.js'
import { useDeleteConfirm } from './StepHistoryList.hooks.js'
import {
	ButtonContainer,
	buttonStyles,
	Columns,
	Container,
	icons,
	ListWrapper,
	PanelHeader,
	StepIndex,
	tableTransformStyle,
	Verb,
} from './StepHistoryList.styles.js'
import type { StepHistoryListProps } from './StepHistoryList.types.js'
import { getCollapsiblePanelStyles } from './StepHistoryList.utils.js'
import { TableTransform } from './TableTransform.js'
const log = debug('datashaper')

export const StepHistoryList: React.FC<StepHistoryListProps> = memo(
	function StepsList({
		onDelete,
		onDuplicateClicked,
		onSelect,
		workflow,
		onSave,
		order,
	}) {
		const ref = useRef<HTMLDivElement>(null)
		const theme = useTheme()
		const steps = useWorkflowSteps(workflow, order)

		const onSelectOriginalTable = useCallback(() => {
			if (workflow.inputNames.size > 0) {
				const names = [...workflow.inputNames]
				const lastInputName = names[names.length - 1]
				if (lastInputName) {
					onSelect?.(lastInputName)
				}
			}
		}, [workflow, onSelect])

		const collapsiblePanelStyles = getCollapsiblePanelStyles(theme)
		const {
			onClick: onDeleteClicked,
			onConfirm: onConfirmDelete,
			toggle: toggleDeleteModal,
			isOpen: isDeleteModalOpen,
		} = useDeleteConfirm(onDelete)

		useEffect(() => {
			const f = () => {
				ref?.current?.scrollIntoView(false)
			}
			f()
		}, [steps])

		const onSelectLatest = useCallback(() => {
			const latestId = steps[0]?.id
			onSelect && latestId && onSelect(latestId)
		}, [onSelect, steps])

		return (
			<Container>
				<CollapsiblePanelContainer>
					<DialogConfirm
						toggle={toggleDeleteModal}
						title="Are you sure you want to delete this step?"
						subText={
							'You will also lose any table transformations made after this step.'
						}
						show={isDeleteModalOpen}
						onConfirm={onConfirmDelete}
					/>
					<ButtonContainer>
						{onSelectOriginalTable && (
							<DefaultButton
								disabled={!steps.length}
								iconProps={icons.preview}
								style={buttonStyles}
								onClick={onSelectOriginalTable}
							>
								Original
							</DefaultButton>
						)}

						<DefaultButton
							disabled={!steps.length}
							iconProps={icons.preview}
							style={buttonStyles}
							onClick={onSelectLatest}
						>
							Latest
						</DefaultButton>
					</ButtonContainer>
					{steps.map(step => {
						const stepIndex = workflow.steps.findIndex(s => s.id === step.id)
						return (
							<CollapsiblePanel
								key={stepIndex}
								styles={collapsiblePanelStyles}
								expandsWithIcon
								onHeaderClick={() => onSelect?.(step.id)}
								onRenderHeader={() => onRenderHeader(step, stepIndex)}
							>
								<ListWrapper>
									<TableTransform
										hideInput
										hideOutput
										key={stepIndex}
										step={step}
										index={stepIndex}
										workflow={workflow}
										style={tableTransformStyle}
										onDelete={onDeleteClicked}
										onDuplicate={onDuplicateClicked}
										onTransformRequested={(s, o) => onSave?.(s, o, stepIndex)}
										hideStepSelector
									/>
								</ListWrapper>
							</CollapsiblePanel>
						)
					})}
				</CollapsiblePanelContainer>
			</Container>
		)
	},
)

function onRenderHeader(step: Step, index: number): JSX.Element {
	const { args } = step
	const columnList: any = (args as any).columns ||
		(args as any).on || [(args as any).column]
	let columns = ''
	try {
		if (Array.isArray(columnList)) {
			columns = columnList.join(', ')
		} else if (typeof columnList === 'object') {
			columns = Object.values(columnList)?.join(', ')
		}
	} catch (e) {
		log(
			'ColumnList type is not being currently supported',
			typeof columnList,
			e,
		)
	}

	return (
		<PanelHeader>
			<Verb>
				<StepIndex>#{index + 1}</StepIndex> {step.verb}
			</Verb>
			<Columns>{columns}</Columns>
		</PanelHeader>
	)
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { useThematic } from '@thematic/react'
import { capitalize } from 'lodash-es'
import { memo, useCallback, useEffect, useRef } from 'react'

import {
	Columns,
	Container,
	ListWrapper,
	PanelHeader,
	tableTransformStyle,
	Verb,
} from './StepHistoryList.styles.js'
import type { StepHistoryListProps } from './StepHistoryList.types.js'
import { getCollapsiblePanelStyles } from './StepHistoryList.utils.js'
import { TableTransform } from './TableTransform.js'

export const StepHistoryList: React.FC<StepHistoryListProps> = memo(
	function StepsList({
		steps,
		onDeleteClicked,
		onDuplicateClicked,
		onSelect,
		workflow,
		onCreate,
		nextInputTable,
	}) {
		const ref = useRef<HTMLDivElement>(null)
		const theme = useThematic()
		const collapsiblePanelStyles = getCollapsiblePanelStyles(theme)

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
					{steps.map(step => {
						const stepIndex = workflow.steps.findIndex(s => s.id === step.id)
						return (
							<CollapsiblePanel
								key={stepIndex}
								styles={collapsiblePanelStyles}
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
										nextInputTable={nextInputTable}
										onDelete={onDeleteClicked}
										onPreview={onSelect}
										onDuplicate={onDuplicateClicked}
										onTransformRequested={(s, o) =>
											onTransformRequested(s, o, stepIndex)
										}
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
	} catch {
		console.error(
			'ColumnList type is not being currently supported',
			typeof columnList,
		)
	}

	return (
		<PanelHeader>
			<Verb>
				#{index + 1} {step.verb}
			</Verb>
			<Columns>{capitalize(columns)}</Columns>
		</PanelHeader>
	)
}

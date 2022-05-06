/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	StepComponent,
	StepSelector,
	useGraphManager,
} from '@data-wrangling-components/react'
import type { DetailsListFeatures } from '@essex/arquero-react'
import { StatsColumnType } from '@essex/arquero-react'
import { IconButton } from '@fluentui/react'
import { memo, useMemo, useState } from 'react'

import { ControlBar } from './ControlBar'
import {
	useAddFilesHandler,
	useChangeStepHandler,
	useCreateStepHandler,
	useHandleStepOutputChanged,
	useInputTables,
	useSteps,
	useWorkflowDownloadUrl,
	useWorkflowState,
} from './DebugPage.hooks'
import {
	Buttons,
	Commands,
	Container,
	icons,
	InputsSection,
	OutputsColumn,
	StepBlock,
	StepsColumn,
	TableSection,
	Workspace,
} from './DebugPage.styles.js'
import { InputTables } from './InputTables'
import { Section } from './Section'
import { Table } from './Table'

const columns = {
	ID: {
		width: 50,
		iconName: 'FavoriteStarFill',
	},
}

const DEFAULT_STATS = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const DebugPage: React.FC = memo(function DebugPage() {
	const [compact, setCompact] = useState<boolean>(true)
	const [autoType, setAutoType] = useState<boolean>(true)
	const [features, setFeatures] = useState<DetailsListFeatures>({
		statsColumnHeaders: true,
		statsColumnTypes: DEFAULT_STATS,
	})

	const inputTables = useInputTables(autoType)
	const graph = useGraphManager(undefined, inputTables)
	const [workflow, setWorkflow] = useWorkflowState(graph)
	const onAddFiles = useAddFilesHandler(graph)
	const steps = useSteps(graph)

	// create a parallel array of output names for the steps
	const outputs = useMemo(
		() =>
			graph.steps
				.map(s => s.id)
				.map(id => {
					const output = graph.outputDefinitions.find(def => def.node === id)
					return output?.name
				}),
		[graph.steps, graph.outputDefinitions],
	)

	const onStepCreate = useCreateStepHandler(graph)
	const onStepChange = useChangeStepHandler(graph)
	const downloadUrl = useWorkflowDownloadUrl(workflow)
	const onStepOutputChange = useHandleStepOutputChanged(graph)

	return (
		<Container>
			<Workspace className="arquero-workspace">
				<ControlBar
					selected={workflow}
					onSelectSpecification={setWorkflow}
					onLoadFiles={onAddFiles}
					features={features}
					onFeaturesChange={setFeatures}
					compact={compact}
					onCompactChange={setCompact}
					autoType={autoType}
					onAutoTypeChange={setAutoType}
				/>
				<InputsSection>
					<Section title="Inputs">
						<InputTables
							tables={inputTables}
							config={columns}
							features={features}
							compact={compact}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => {
					const output = outputs[index]
					const table = output ? graph.latest(output)?.table : undefined
					return (
						<StepBlock key={`step-${index}`} className="step-block">
							<Section title={`Step ${index + 1}`} subtitle={step.verb}>
								<StepsColumn className="steps-column">
									<StepComponent
										key={`step-${index}`}
										step={step}
										graph={graph}
										index={index}
										output={output}
										onChange={onStepChange}
										onChangeOutput={output => onStepOutputChange(step, output)}
									/>
								</StepsColumn>
								<OutputsColumn className="outputs-column">
									{table ? (
										<TableSection
											key={`output-${index}`}
											className="table-section"
										>
											<Table
												name={step.id}
												table={table}
												config={columns}
												features={features}
												compact={compact}
											/>
										</TableSection>
									) : null}
								</OutputsColumn>
							</Section>
						</StepBlock>
					)
				})}
				<Commands>
					<StepSelector onCreate={onStepCreate} showButton />
					<Buttons>
						<IconButton
							title={'Save workflow as JSON'}
							iconProps={icons.download}
							href={downloadUrl}
							download={'workflow.json'}
							type={'application/json'}
						/>
					</Buttons>
				</Commands>
			</Workspace>
		</Container>
	)
})

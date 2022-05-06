/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow, Step } from '@data-wrangling-components/core'
import { StepComponent, StepSelector } from '@data-wrangling-components/react'
import type { DetailsListFeatures } from '@essex/arquero-react'
import { StatsColumnType } from '@essex/arquero-react'
import { IconButton, PrimaryButton } from '@fluentui/react'
import { memo, useCallback, useState, useMemo } from 'react'

import { ControlBar } from './ControlBar'
import { useSteps, useInitialData } from './DebugPage.hooks'
import {
	Buttons,
	Commands,
	Container,
	InputsSection,
	OutputsColumn,
	StepBlock,
	StepsColumn,
	TableSection,
	Workspace,
	runPipelineRootStyles,
	icons,
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
	const [exampleSpec, setExampleSpec] = useState<Workflow | undefined>()
	const [autoType, setAutoType] = useState<boolean>(true)
	const [features, setFeatures] = useState<DetailsListFeatures>({
		statsColumnHeaders: true,
		statsColumnTypes: DEFAULT_STATS,
	})

	const { tables, graph, onAddFiles } = useInitialData(autoType)
	const steps = useSteps(graph)

	// const {
	// 	steps,
	// 	result,
	// 	outputs,
	// 	onStepCreate,
	// 	onStepChange,
	// 	onLoadPipeline,
	// 	doRunPipeline,
	// } = useSteps(store)

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

	const handleExampleSpecChange = useCallback(
		(spec: Workflow | undefined) => {
			setExampleSpec(spec)
			graph.reset(spec)
		},
		[setExampleSpec, graph],
	)

	const onStepChange = useCallback(
		(step: Step, index: number) => {
			graph.reconfigureStep(index, step)
		},
		[graph],
	)

	const downloadUrl = useMemo(() => {
		const blob = new Blob([
			JSON.stringify(graph.workflow.toJsonObject(), null, 4),
		])
		return URL.createObjectURL(blob)
	}, [steps])

	const onStepOutputChange = (output: string | undefined) => null

	return (
		<Container>
			<Workspace className="arquero-workspace">
				<ControlBar
					selected={exampleSpec}
					onSelectSpecification={handleExampleSpecChange}
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
							tables={tables}
							config={columns}
							features={features}
							compact={compact}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => {
					const output = outputs[index]
					return (
						<StepBlock key={`step-${index}`} className="step-block">
							<Section title={`Step ${index + 1}`} subtitle={step.verb}>
								<StepsColumn className="steps-column">
									<StepComponent
										key={`step-${index}`}
										step={step}
										graph={graph}
										index={index}
										onChange={onStepChange}
										onChangeOutput={onStepOutputChange}
									/>
								</StepsColumn>
								<OutputsColumn className="outputs-column">
									{output ? (
										<TableSection
											key={`output-${index}`}
											className="table-section"
										>
											<Table
												name={step.id}
												table={graph.latest(output)?.table!}
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
				{/* <Section
					title={`${steps.length} step${steps.length !== 1 ? 's' : ''}`}
					subtitle={'FINAL RESULT'}
				>
					{result ? (
						<TableSection className="table-section">
							<Table
								table={result!.table!}
								config={columns}
								features={features}
								compact={compact}
							/>
						</TableSection>
					) : null}
				</Section> */}
				{/* <Commands>
					<StepSelector onCreate={onStepCreate} showButton />
					<Buttons>
						<PrimaryButton
							onClick={doRunPipeline}
							styles={runPipelineRootStyles}
						>
							Run all
						</PrimaryButton>
						<IconButton
							title={'Save workflow as JSON'}
							iconProps={icons.download}
							href={downloadUrl}
							download={'workflow.json'}
							type={'application/json'}
						/>
					</Buttons>
				</Commands> */}
			</Workspace>
		</Container>
	)
})

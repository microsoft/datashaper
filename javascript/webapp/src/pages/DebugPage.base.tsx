/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StepSelector, useGraphManager } from '@data-wrangling-components/react'
import type { DetailsListFeatures } from '@essex/arquero-react'
import { StatsColumnType } from '@essex/arquero-react'
import { IconButton } from '@fluentui/react'
import { memo, useMemo, useState } from 'react'

import { ControlBar } from '../components/ControlBar.js'
import { InputTables } from '../components/InputTables.js'
import { Section } from '../components/Section.js'
import { StepOutput } from '../components/StepOutput.js'
import {
	useAddFilesHandler,
	useChangeStepHandler,
	useCreateStepHandler,
	useHandleStepOutputChanged,
	useInputTables,
	useSteps,
	useWorkflowDownloadUrl,
	useWorkflowState,
} from './DebugPage.hooks.js'
import {
	Buttons,
	columnsStyle,
	Commands,
	Container,
	icons,
	InputsSection,
	Workspace,
} from './DebugPage.styles.js'

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
							config={columnsStyle}
							features={features}
							compact={compact}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => (
					<StepOutput
						step={step}
						index={index}
						key={step.id}
						graph={graph}
						output={outputs[index]!}
						features={features}
						compact={compact}
						onStepChange={onStepChange}
						onStepOutputChange={onStepOutputChange}
					/>
				))}
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

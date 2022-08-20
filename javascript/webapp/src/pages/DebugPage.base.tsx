/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/core'
import type { DetailsListFeatures } from '@datashaper/react'
import {
	StatsColumnType,
	StepSelector,
	useGraphSteps,
	useGraphWorkflow,
	useHandleStepOutputChanged,
	useHandleStepSave,
	useStepOutputs,
} from '@datashaper/react'
import { ActionButton } from '@fluentui/react'
import { memo, useState } from 'react'

import { ControlBar } from '../components/ControlBar.js'
import { InputTables } from '../components/InputTables.js'
import { Section } from '../components/Section.js'
import { StepOutput } from '../components/StepOutput.js'
import {
	useAddFilesHandler,
	useCreateStepHandler,
	useInputTables,
	useWorkflowDownloadUrl,
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
	const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined)
	const graph = useGraphWorkflow(workflow, inputTables)
	const steps = useGraphSteps(graph)
	const outputs = useStepOutputs(
		graph,
		(idx: number) => `step-${idx}`,
	) as string[]
	const downloadUrl = useWorkflowDownloadUrl(workflow)
	const onAddFiles = useAddFilesHandler(graph)
	const onStepSave = useHandleStepSave(graph)
	const onStepCreate = useCreateStepHandler(graph)
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
						output={outputs[index]}
						features={features}
						compact={compact}
						onStepChange={onStepSave}
						onStepOutputChange={onStepOutputChange}
					/>
				))}
				<Commands>
					<StepSelector onCreate={onStepCreate} showButton />
					<Buttons>
						<ActionButton
							title={'Save workflow as JSON'}
							iconProps={icons.download}
							href={downloadUrl}
							download={'workflow.json'}
							type={'application/json'}
						>
							Download workflow
						</ActionButton>
					</Buttons>
				</Commands>
			</Workspace>
		</Container>
	)
})

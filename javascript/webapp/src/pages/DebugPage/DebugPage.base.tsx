/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '@datashaper/react'
import {
	StatsColumnType,
	StepSelector,
	useHandleStepOutputChanged,
	useHandleStepSave,
	useStepOutputs,
	useWorkflow,
	useWorkflowSteps,
} from '@datashaper/react'
import type { Workflow } from '@datashaper/workflow'
import { ActionButton } from '@fluentui/react'
import { memo, useState } from 'react'

import { ControlBar } from './components/ControlBar.js'
import { InputTables } from './components/InputTables.js'
import { Section } from './components/Section.js'
import { StepOutput } from './components/StepOutput.js'
import {
	useAddFilesHandler,
	useCreateStepHandler,
	useInputTables,
	useWorkflowDownloadUrl,
} from './DebugPage.hooks.js'
import {
	Buttons,
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
	const [autoType, setAutoType] = useState<boolean>(true)
	const [features, setFeatures] = useState<DetailsListFeatures>({
		statsColumnHeaders: true,
		statsColumnTypes: DEFAULT_STATS,
	})

	const inputTables = useInputTables(autoType)
	const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined)
	const wf = useWorkflow(workflow, inputTables)
	const steps = useWorkflowSteps(wf)
	const outputs = useStepOutputs(wf, (idx: number) => `step-${idx}`) as string[]
	const downloadUrl = useWorkflowDownloadUrl(workflow)
	const onAddFiles = useAddFilesHandler(wf)
	const onStepSave = useHandleStepSave(wf)
	const onStepCreate = useCreateStepHandler(wf)
	const onStepOutputChange = useHandleStepOutputChanged(wf)

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
							features={features}
							compact={true}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => (
					<StepOutput
						step={step}
						index={index}
						key={step.id}
						workflow={wf}
						output={outputs[index]}
						features={features}
						compact={true}
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Workflow } from '@datashaper/workflow'
import { memo, useState } from 'react'

import { useWorkflow } from '../../../hooks/common.js'
import { useHandleStepOutputChanged } from '../../../hooks/useHandleStepOutputChanged.js'
import { useHandleStepSave } from '../../../hooks/useHandleStepSave.js'
import { useStepOutputs } from '../../../hooks/useStepOutputs.js'
import { useWorkflowSteps } from '../../../hooks/useWorkflowSteps.js'
import { ExamplesDropdown } from './components/ExamplesDropdown.js'
import { StepOutput } from './components/StepOutput.js'
import { useInputTables } from './Examples.hooks.js'
import {
	Container,
	Description,
	Dropdown,
	Header,
	Output,
} from './Examples.styles.js'

export interface ExamplesProps {
	inputs: TableContainer[]
}

export const Examples: React.FC<ExamplesProps> = memo(function Examples({
	inputs,
}) {
	const tables = useInputTables(inputs)
	const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined)
	const wf = useWorkflow(workflow, tables)
	const steps = useWorkflowSteps(wf)
	const outputs = useStepOutputs(wf, (idx: number) => `step-${idx}`) as string[]
	const onStepSave = useHandleStepSave(wf)
	const onStepOutputChange = useHandleStepOutputChanged(wf)
	return (
		<Container>
			<Header>
				<Dropdown>
					<ExamplesDropdown onChange={setWorkflow} />
				</Dropdown>
				<Description>{workflow?.description || ''}</Description>
			</Header>
			<Output>
				{steps.map((step, index) => (
					<StepOutput
						step={step}
						index={index}
						key={step.id}
						workflow={wf}
						output={outputs[index]!}
						onStepChange={onStepSave}
						onStepOutputChange={onStepOutputChange}
					/>
				))}
			</Output>
		</Container>
	)
})

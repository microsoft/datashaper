/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { memo, useMemo } from 'react'

import { DisplayOrder } from '../../../../enums.js'
import { useOnStepOutputChanged } from '../../../../hooks/steps/useOnStepOutputChanged.js'
import { useOnStepSave } from '../../../../hooks/steps/useOnStepSave.js'
import { useStepOutputs } from '../../../../hooks/steps/useStepOutputs.js'
import { useWorkflow } from '../../../../hooks/useFormattedColumnArg.js'
import { useWorkflowSteps } from '../../../../hooks/workflow/useWorkflowSteps.js'
import { StepOutput } from './components/StepOutput.js'
import { useInputTables } from './WorkflowExample.hooks.js'
import { Container, Description, Output } from './WorkflowExample.styles.js'

export interface WorkflowExampleProps {
	schema: WorkflowSchema
	inputs: TableContainer[]
}

export const WorkflowExample: React.FC<WorkflowExampleProps> = memo(
	function Examples({ schema, inputs }) {
		const tables = useInputTables(inputs)
		const workflow = useMemo(() => new Workflow(schema), [schema])
		const wf = useWorkflow(workflow, tables)
		const steps = useWorkflowSteps(wf, DisplayOrder.FirstOnTop)
		const outputs = useStepOutputs(wf) as string[]
		const onStepSave = useOnStepSave(wf)
		const onStepOutputChange = useOnStepOutputChanged(wf)
		return (
			<Container>
				<Description>{workflow?.description || ''}</Description>
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
	},
)

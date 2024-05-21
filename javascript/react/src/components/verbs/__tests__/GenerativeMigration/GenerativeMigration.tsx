/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Step } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import { memo, useCallback, useMemo, useState } from 'react'

import { DisplayOrder } from '../../../../enums.js'
import { useWorkflow } from '../../../../hooks/index.js'
import { useWorkflowSteps } from '../../../../hooks/workflow/useWorkflowSteps.js'
import { useInputTables } from './GenerativeMigration.hooks.js'
import {
	Column,
	Columns,
	Container,
	StepContainer,
	Subtitle,
	Title,
} from './GenerativeMigration.styles.js'
import { StepForm } from '../../../StepForm/StepForm.js'
import { selectStepForm } from '../../../StepForm/selectStepForm.js'
import { RJSFForm } from '../../forms/forms/RJSFForm.js'
import { useWorkflowSchema } from '../../forms/forms/RJSFForm.hooks.js'

export interface GenerativeMigrationProps {
	schema: WorkflowSchema
	inputs: TableContainer[]
}

export const GenerativeMigration: React.FC<GenerativeMigrationProps> = memo(
	function Examples({ schema, inputs }) {
		const tables = useInputTables(inputs)
		const workflow = useMemo(() => new Workflow(schema), [schema])
		const wf = useWorkflow(workflow, tables)
		const steps = useWorkflowSteps(wf, DisplayOrder.FirstOnTop)

		const workflowSchema = useWorkflowSchema()
		if (!workflowSchema) {
			return null
		}
		return (
			<Container>
				{steps.map((step, index) => {
					return (
						<StepUIs
							key={`steps-${index}`}
							workflow={wf}
							index={index}
							step={step}
							workflowSchema={workflowSchema}
						/>
					)
				})}
			</Container>
		)
	},
)

const StepUIs: React.FC<any> = ({ workflow, index, step, workflowSchema }) => {
	const [local, setLocal] = useState<Step>(step)
	const onStepSave = useCallback(
		(s: Step) => {
			workflow.updateStep(s, index)
			setLocal(s)
		},
		[workflow, index],
	)
	const StepArgs = selectStepForm(local)
	return (
		<StepContainer>
			<Title>{local.verb}</Title>
			<Columns>
				<Column>
					<Subtitle>HOC</Subtitle>
					<StepForm
						step={local}
						workflow={workflow}
						index={index}
						onChange={onStepSave}
					/>
				</Column>
				<Column>
					<Subtitle>Hand-built StepArgs</Subtitle>
					<StepArgs step={local} workflow={workflow} onChange={onStepSave} />
				</Column>
				<Column>
					<Subtitle>Generative</Subtitle>
					<RJSFForm step={local} workflow={workflow} onChange={onStepSave} schema={workflowSchema}/>
				</Column>
			</Columns>
		</StepContainer>
	)
}

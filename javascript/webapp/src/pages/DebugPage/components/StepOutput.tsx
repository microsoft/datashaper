/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StepComponent, StepDescription, useDataTable } from '@datashaper/react'
import { memo } from 'react'

import { Section } from './Section.js'
import {
	columnsStyle,
	OutputsColumn,
	StepBlock,
	StepsColumn,
	TableSection,
} from './StepOutput.styles.js'
import type { StepOutputProps } from './StepOutput.types.js'
import { Table } from './Table.js'

export const StepOutput: React.FC<StepOutputProps> = memo(function StepOutput({
	step,
	index,
	graph,
	output,
	features,
	compact,
	onStepChange,
	onStepOutputChange,
}) {
	const table = useDataTable(output, graph)

	return (
		<StepBlock className="step-block">
			<Section title={`Step ${index + 1}`} subtitle={step.verb}>
				<StepsColumn className="steps-column">
					<StepComponent
						step={step}
						graph={graph}
						index={index}
						output={output}
						onChange={onStepChange}
						onChangeOutput={o => onStepOutputChange(step, o)}
					/>
					<StepDescription step={step} output={output} />
				</StepsColumn>

				<OutputsColumn className="outputs-column">
					{table ? (
						<TableSection className="table-section">
							<Table
								name={output}
								table={table}
								config={columnsStyle}
								features={features}
								compact={compact}
							/>
						</TableSection>
					) : null}
				</OutputsColumn>
			</Section>
		</StepBlock>
	)
})

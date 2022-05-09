import { memo } from 'react'
import type { StepOutputProps } from './StepOutput.types.js'
import {
	OutputsColumn,
	StepBlock,
	StepsColumn,
	TableSection,
	columnsStyle,
} from './StepOutpput.styles.js'
import { Section } from './Section'
import { Table } from './Table'
import { StepComponent, useDataTable } from '@data-wrangling-components/react'

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
		<StepBlock key={`step-${index}`} className="step-block">
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
				</StepsColumn>
				<OutputsColumn className="outputs-column">
					{table ? (
						<TableSection key={`output-${index}`} className="table-section">
							<Table
								name={step.id}
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

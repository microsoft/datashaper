/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { memo, useCallback, useMemo } from 'react'
import { selectStepComponent } from '../selectStepComponent.js'
import { LeftAlignedRow } from '../styles.js'
import { Container } from './StepComponent.styles.js'
import type { StepComponentProps } from './StepComponent.types.js'
import { StepComponentOutputTable } from './StepComponentOutputTable.js'
import { StepInputColumn } from './StepInputColumn.js'
import { StepInputTable } from './StepInputTable.js'
import { StepOutputColumn } from './StepOutputColumn.js'

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({
		step,
		output,
		graph,
		index,
		inputTableLabel,
		inputColumnLabel,
		outputColumnLabel,
		outputTableLabel,
		outputTableDisabled,
		onChange,
		onChangeOutput,
	}) {
		const StepArgs = useMemo(
			() => (step ? selectStepComponent(step) : null),
			[step],
		)
		const handleStepChange = useCallback(
			(step: Step) => onChange(step, index),
			[index, onChange],
		)
		return StepArgs == null ? null : (
			<Container className="step-component">
				<LeftAlignedRow>
					<StepInputTable
						step={step}
						label={inputTableLabel}
						graph={graph}
						onChange={handleStepChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<StepInputColumn
						step={step}
						label={inputColumnLabel}
						graph={graph}
						onChange={handleStepChange}
					/>
				</LeftAlignedRow>
				<StepArgs
					step={step}
					output={output}
					onChangeOutput={onChangeOutput}
					onChange={handleStepChange}
				/>
				<LeftAlignedRow>
					<StepOutputColumn
						label={outputColumnLabel}
						step={step}
						onChange={handleStepChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<StepComponentOutputTable
						step={step}
						disabled={outputTableDisabled}
						label={outputTableLabel}
						output={output}
						onChange={handleStepChange}
						onChangeOutput={onChangeOutput}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

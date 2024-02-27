/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@datashaper/schema'
import { num } from '@datashaper/utilities'
import { Position, SpinButton } from '@fluentui/react'
import { format } from 'd3-format'
import { memo } from 'react'

import { useSpinButtonChangeHandler } from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import {
	Container,
	Input,
	InputLabel,
	OrLabel,
	spinStyles,
} from './SampleForm.styles.js'
import { Expando } from '@essex/components'
import { dropdownStyles } from '../styles.js'

const whole = format('d')

/**
 * Provides inputs for a Sample step.
 */
export const SampleForm: React.FC<StepFormProps<SampleArgs>> = memo(
	function SampleForm({ step, onChange }) {
		const handleSizeChange = useSpinButtonChangeHandler(
			step,
			(s, val) => {
				s.args.size = num(val)
			},
			onChange,
		)

		const handlePercentChange = useSpinButtonChangeHandler(
			step,
			(s, val) => {
				s.args.proportion = val != null ? +val / 100 : undefined
			},
			onChange,
		)

		const handleSeedChange = useSpinButtonChangeHandler(
			step,
			(s, val) => {
				s.args.seed = val != null ? +val : undefined
			},
			onChange,
		)

		return (
			<Container>
				<Input>
					<InputLabel># rows</InputLabel>
					<SpinButton
						min={0}
						step={1}
						disabled={!!step.args.proportion}
						value={step.args.size ? `${step.args.size}` : ''}
						styles={spinStyles}
						onChange={handleSizeChange}
					/>
				</Input>
				<OrLabel>or</OrLabel>
				<Input>
					<InputLabel>percentage</InputLabel>
					<SpinButton
						min={0}
						max={100}
						step={1}
						disabled={!!step.args.size}
						value={
							step.args.proportion ? `${whole(step.args.proportion * 100)}` : ''
						}
						styles={spinStyles}
						onChange={handlePercentChange}
					/>
				</Input>
				<Expando
					label={'Advanced'}
					styles={{
						root: {
							marginTop: 8,
						},
					}}
				>
					<SpinButton
						label='Randomizing seed'
						labelPosition={Position.top}
						step={1}
						max={1000}
						value={step.args.seed ? `${step.args.seed}` : ''}
						styles={dropdownStyles}
						onChange={handleSeedChange}
					/>
				</Expando>
			</Container>
		)
	},
)

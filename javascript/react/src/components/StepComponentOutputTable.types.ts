import type { StepComponentProps } from '../types.js'

export interface StepComponentOutputTableProps {
	label?: string
	disabled?: boolean
	step: StepComponentProps['step']
	output: StepComponentProps['output']
	onChange: StepComponentProps['onChange']
	onChangeOutput: StepComponentProps['onChangeOutput']
}

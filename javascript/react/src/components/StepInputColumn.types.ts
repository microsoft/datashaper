import type { StepComponentProps } from '../types.js'
import type { Step, GraphManager } from '@data-wrangling-components/core'

export interface StepInputColumnProps {
	label?: string
	step: Step
	graph: GraphManager
	onChange: StepComponentProps['onChange']
}

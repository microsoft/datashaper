import type { StepComponentProps } from '../types.js'
import type { Step } from '@data-wrangling-components/core'

export interface StepComponentOutputColumnProps {
	label?: string
	step: Step
	onChange: StepComponentProps['onChange']
}

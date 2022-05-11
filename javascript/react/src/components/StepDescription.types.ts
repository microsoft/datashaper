import type { Step } from '@data-wrangling-components/core'

export interface StepDescriptionProps {
	/**
	 * The processing step
	 */
	step: Step

	/**
	 * The output table name
	 */
	output?: string
}

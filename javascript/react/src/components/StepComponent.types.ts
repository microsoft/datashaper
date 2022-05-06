/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@data-wrangling-components/core'

export interface StepComponentProps {
	/**
	 * The graph manager
	 */
	graph: GraphManager

	/**
	 * The processing step
	 */
	step: Step

	/**
	 * The step index
	 */
	index: number

	/**
	 * The output table name
	 */
	output?: string

	/**
	 * The step onchange handler
	 */
	onChange: (step: Step, index: number) => void

	/**
	 * Event handler for when the output table name changes
	 */
	onChangeOutput: (value: string | undefined) => void
}

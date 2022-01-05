/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableStore, Step } from '@data-wrangling-components/core'

export interface StepDependent {
	step: Step
}

export interface StepComponentProps extends StepDependent {
	store: TableStore
	/**
	 * Optional override of step input - there are many scenarios
	 * (particularly compound) where the driving input table for UI visbility should be shared,
	 * but the input to the actual step is an intermediate table.
	 */
	input?: string
	onChange?: (step: Step) => void
}

export type StepDescriptionProps = StepDependent

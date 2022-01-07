/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableStore, Step } from '@data-wrangling-components/core'
import { IDropdownOption } from '@fluentui/react'

export type StepChangeFunction = (step: Step) => void

export type DropdownOptionChangeFunction = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void

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
	onChange?: StepChangeFunction
}

export interface StepDescriptionProps extends StepDependent {
	showInput?: boolean
	showOutput?: boolean
}

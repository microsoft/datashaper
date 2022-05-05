/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export type StepChangeFunction<T extends object | void | unknown = unknown> = (
	step: Step<T>,
) => void
export interface StepDependent<T extends object | void | unknown = unknown> {
	step: Step<T>
}

export interface DescriptionRow {
	/**
	 * Text to display in normal font before the value
	 */
	before?: string
	/**
	 * The configuration value to display with emphasized font
	 */
	value?: any
	/**
	 * Text to display in normal font after the value
	 */
	after?: string
	/**
	 * Recursive row children to render indented
	 */
	sub?: DescriptionRow[]
	/**
	 * Optional title text to use on node for tooltips/overflow
	 */
	title?: string
}

export interface VerbDescriptionProps<
	T extends object | void | unknown = unknown,
> extends StepDescriptionProps<T> {
	rows: DescriptionRow[]
}

export interface StepDescriptionProps<
	T extends object | void | unknown = unknown,
> extends StepDependent<T> {
	style?: React.CSSProperties
	showInput?: boolean
	showOutput?: boolean
	showOutputColumn?: boolean
	actions?: JSX.Element
}
/**
 * For reusable subcomponents that are combined in one interface
 * to manipulate a step.
 */
export interface StepSubcomponentProps<
	T extends object | void | unknown = unknown,
> extends StepComponentProps<T> {
	label?: string
}

/**
 * Basic props for a dump-component (not store/arquero attached)
 */
export interface StepComponentBaseProps<
	T extends object | void | unknown = unknown,
> extends StepDependent<T> {
	/**
	 * Event handler for when the step is changed in the component
	 */
	onChange?: StepChangeFunction<T>
}

export interface StepComponentProps<T extends object | void | unknown = unknown>
	extends StepComponentBaseProps<T> {
	/**
	 * TableStore to use for table lookups of step parameters.
	 */
	graph?: GraphManager
	/**
	 * ColumnTable to execute the step against if no store is provided.
	 */
	table?: ColumnTable
	/**
	 * Optional override of step input - there are many scenarios
	 * (particularly chains) where the driving input table for UI visbility should be shared,
	 * but the input to the actual step is an intermediate table.
	 */
	input?: string
	/**
	 * Optional override for the label
	 */
	label?: string
}

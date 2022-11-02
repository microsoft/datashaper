/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'

export interface VerbDescriptionProps<
	T extends object | void | unknown = unknown,
> extends StepDescriptionProps<T> {
	rows: DescriptionRow[]
}

export interface StepDescriptionProps<
	T extends object | void | unknown = unknown,
> {
	step: Step<T>
	style?: React.CSSProperties
	showInput?: boolean
	showOutput?: boolean
	showOutputColumn?: boolean
	actions?: JSX.Element

	/** The output table name */
	output: string | undefined
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

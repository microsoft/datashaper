/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Field, ValidationResult } from '@datashaper/schema'
import type { IColumn, IDetailsRowProps } from '@fluentui/react'

import type { ColumnSelectFunction, DropdownOptionSelect } from '../index.js'

export interface Dimensions {
	width: number
	height: number
}

export interface FormattedCellProps extends ColumnCellProps {
	textAlign?: 'left' | 'center' | 'right'
	/**
	 * d3-format compatible format specifier for numbers
	 * https://github.com/d3/d3-format
	 */
	numberFormat?: string
	color?: string
	virtual?: boolean
	validationResult?: ValidationResult
}

/**
 * Basic props for a column cell's render function
 */
export interface ColumnCellProps {
	item?: any
	index?: number
	column?: IColumn
}

export interface DropdownCellProps extends ColumnCellProps {
	rowIndex: number
	onCellDropdownSelect?: DropdownOptionSelect
}

export interface ColumnCellChartProps extends ColumnCellProps {
	color?: string
	categories?: Record<string | number, number>
}

export interface MagnitudeCellProps extends FormattedCellProps {
	/**
	 * Value from 0-1 indicating relative magnitude within the column
	 */
	magnitude?: number
}

export interface RichCellProps extends FormattedCellProps {
	field?: Field
	onSelect?: ColumnSelectFunction
	onCellDropdownSelect?: DropdownOptionSelect
	validationResult?: ValidationResult
}

export interface StatsHeaderProps {
	field: Field
	color?: string
	column?: IColumn
	stats?: string[]
	onSelect?: ColumnSelectFunction
}

export interface RichRowProps extends IDetailsRowProps {
	striped?: boolean
	columnBorders?: boolean
	compactRowHeight: number
}

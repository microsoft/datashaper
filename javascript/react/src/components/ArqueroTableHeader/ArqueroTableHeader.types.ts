/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { CSSProperties, ReactElement } from 'react'

export interface ArqueroTableHeaderStyles {
	root?: CSSProperties
}

/**
 * Props for the ArqueroTableHeader component
 */
export interface ArqueroTableHeaderProps {
	/**
	 * The arquero table to render
	 */
	table: ColumnTable

	/**
	 * The table name
	 */
	name?: string

	/**
	 * Whether to show the row count
	 */
	showRowCount?: boolean

	/**
	 * Whether to show the column count
	 */
	showColumnCount?: boolean

	/**
	 * The optional command bar
	 */
	commandBar?: ReactElement<any, any>

	/**
	 * The optional far-command bar
	 */
	farCommandBar?: ReactElement<any, any>

	/**
	 * Column-names that are visible
	 */
	visibleColumns?: string[]

	/**
	 * The table color
	 */
	color?: string

	/**
	 * The table background color
	 */
	background?: string

	/**
	 * The table styles
	 */
	styles?: ArqueroTableHeaderStyles
}

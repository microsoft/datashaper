/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'

export interface TableListBarProps {
	/**
	 * The input tables
	 */
	inputs: TableContainer[]

	/**
	 * The output tables
	 */
	derived: TableContainer[]

	/**
	 * The table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * The selected table id
	 */
	selected?: string

	/**
	 * The load-state
	 */
	loading?: boolean
}

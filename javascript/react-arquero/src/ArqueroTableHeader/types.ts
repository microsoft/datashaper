/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ReactElement } from 'react'

export interface ArqueroTableHeaderProps {
	table: ColumnTable
	name?: string
	showRowCount?: boolean
	showColumnCount?: boolean
	commandBar?: ReactElement<any, any>
	farCommandBar?: ReactElement<any, any>
	visibleColumns?: string[]
	onRenameTable?: (name: string) => void
	color?: string
	bgColor?: string
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

export interface ArqueroTableHeaderProps {
	table: ColumnTable
	name?: string
	showRowCount?: boolean
	showColumnCount?: boolean
	commands?: ICommandBarItemProps[]
	visibleColumns?: string[]
	onRenameTable?: (name: string) => void
}

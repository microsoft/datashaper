/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface ArqueroTableHeaderProps {
	table: ColumnTable
	name?: string
	showRowCount?: boolean
	showColumnCount?: boolean
	commandBar?: JSX.Element | null
	commands?: ICommandBarItemProps[]
	farCommands?: ICommandBarItemProps[]
	visibleColumns?: string[]
	onRenameTable?: (name: string) => void
	colors?: {
		background?: string
		foreground?: string
	}
}

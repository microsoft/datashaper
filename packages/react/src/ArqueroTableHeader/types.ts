import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Table options specific to command execution
 */
export interface CommandOptions {
	allowDownload?: boolean
	downloadFilename?: string
}

export interface ArqueroTableHeaderProps extends CommandOptions {
	table: ColumnTable
	name?: string
	showRowCount?: boolean
	showColumnCount?: boolean
	commands?: ICommandBarItemProps[]
}

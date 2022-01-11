import { ICommandBarItemProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { merge } from 'lodash'
import { useMemo } from 'react'
import { download, visiblecolumns } from '../commands'
import { CommandOptions } from '../types'

export function useCommands(
	table: ColumnTable,
	commands: ICommandBarItemProps[] = [],
	options: CommandOptions = {},
) {
	const theme = useThematic()
	return useMemo(() => {
		const { allowDownload, downloadFilename } = options
		const cmds: ICommandBarItemProps[] = [...commands]
		// if commands are not supplied, add a few based on options
		if (cmds.length === 0) {
			if (allowDownload) {
				cmds.push(download(table, downloadFilename))
			}
			cmds.push(
				visiblecolumns(
					table.columnNames().map(c => ({
						name: c,
						checked: true,
					})),
				),
			)
		}
		// all commands get style overrides to match theming
		return cmds.map(c =>
			merge(
				{},
				{
					iconProps: {
						styles: {
							root: {
								color: theme.application().background().hex(),
							},
						},
					},
					buttonStyles: {
						root: {
							background: theme.application().accent().hex(),
							color: theme.application().background().hex(),
						},
					},
				},
				c,
			),
		)
	}, [theme, commands, options])
}

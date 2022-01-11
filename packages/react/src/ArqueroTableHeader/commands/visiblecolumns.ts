import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

export function visiblecolumns(
	table: ColumnTable,
	selectedColumns: string[],
	onCheckChange?: (column: string, checked: boolean) => void,
): ICommandBarItemProps {
	const click = () => {}

	// const items = table.columnNames().map(column => )
	return {
		key: 'visible-columns',
		iconProps: {
			iconName: 'ColumnVerticalSection',
		},
		onClick: click,
		split: false,
		subMenuProps: {
			items: columns.map(column => ({
				key: column.name,
				text: column.name,
				canCheck: true,
				checked: column.checked,
			})),
		},
	}
}

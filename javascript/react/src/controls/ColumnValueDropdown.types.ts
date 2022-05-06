import type { IDropdownOption, IDropdownProps } from '@fluentui/react'

export interface ColumnValueDropdownProps extends Partial<IDropdownProps> {
	options: IDropdownOption[]
}

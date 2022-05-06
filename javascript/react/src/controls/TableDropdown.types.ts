import type { IDropdownOption, IDropdownProps } from '@fluentui/react'

export interface TableDropdownProps extends Partial<IDropdownProps> {
	options: IDropdownOption[]
}

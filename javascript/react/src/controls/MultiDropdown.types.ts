import type { IDropdownOption, IDropdownProps } from '@fluentui/react'

export interface MultiDropdownProps extends IDropdownProps {
	onSelectAllOrNone?: (options: IDropdownOption[]) => void
}

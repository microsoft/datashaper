import type { IComboBoxOption, IComboBoxProps } from '@fluentui/react'

export interface ColumnOrValueComboBoxProps extends Partial<IComboBoxProps> {
	options: IComboBoxOption[]
}

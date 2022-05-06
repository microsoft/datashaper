import { IComboBoxOption, SelectableOptionMenuItemType } from '@fluentui/react'
import { useMemo } from 'react'
import type { ColumnOrValueComboBoxProps } from './ColumnOrValueComboBox.types.js'

export function useOptions(
	options: ColumnOrValueComboBoxProps['options'],
): IComboBoxOption[] {
	return useMemo(() => [HEADER, ...options], [options])
}

const HEADER: IComboBoxOption = {
	key: 'header',
	text: 'Columns',
	itemType: SelectableOptionMenuItemType.Header,
}

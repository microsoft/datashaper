import { IComboBoxOption, SelectableOptionMenuItemType } from '@fluentui/react'
import { useMemo } from 'react'
import { getDateFormatPatternOptions } from '../dateFormats.js'

export function useOptions(): IComboBoxOption[] {
	return useMemo<IComboBoxOption[]>(
		() => [HEADER, ...getDateFormatPatternOptions()],
		[],
	)
}

const HEADER: IComboBoxOption = {
	key: 'header',
	text: 'Values',
	itemType: SelectableOptionMenuItemType.Header,
}

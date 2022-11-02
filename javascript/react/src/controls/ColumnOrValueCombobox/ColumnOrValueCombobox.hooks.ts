/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { SelectableOptionMenuItemType } from '@fluentui/react'
import { useMemo } from 'react'

import type { ColumnOrValueComboboxProps } from './ColumnOrValueCombobox.types.js'

export function useOptions(
	options: ColumnOrValueComboboxProps['options'],
): IComboBoxOption[] {
	return useMemo(() => [HEADER, ...options], [options])
}

const HEADER: IComboBoxOption = {
	key: 'header',
	text: 'Columns',
	itemType: SelectableOptionMenuItemType.Header,
}

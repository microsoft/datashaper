/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption} from '@fluentui/react';
import { SelectableOptionMenuItemType } from '@fluentui/react'
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

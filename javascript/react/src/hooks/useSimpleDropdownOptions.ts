/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
/**
 * Make a basic set of string options from an array
 * @param list -
 * @returns
 */
export function useSimpleDropdownOptions(list: string[]): IDropdownOption[] {
	return useMemo(() => getSimpleDropdownOptions(list), [list])
}

export function getSimpleDropdownOptions(list: string[]): IDropdownOption[] {
	return list.map(name => ({
		key: name,
		text: name.toString(),
	}))
}

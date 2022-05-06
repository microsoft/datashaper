/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, ISelectableOption } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { useCallback, useMemo } from 'react'

import { Link, Selector, Sep } from './MultiDropdown.styles.js'
import type { MultiDropdownProps } from './MultiDropdown.types.js'

export function useDropdownOptions(
	options: MultiDropdownProps['options'],
	selectedKeys: MultiDropdownProps['selectedKeys'],
): IDropdownOption<any>[] {
	return useMemo(() => {
		const hash = (selectedKeys || ([] as any)).reduce(
			(acc: Record<string, boolean>, cur: any) => {
				acc[cur] = true
				return acc
			},
			{},
		)
		const main: IDropdownOption[] = options.map(option => {
			const selected = !!hash[option.key]
			return {
				...option,
				selected,
			}
		})
		return [
			...main,
			{
				key: '--divider--',
				text: '-',
				itemType: 1,
				selected: false,
			},
			{
				key: '--actions--',
				text: '',
				itemType: 2,
				data: true,
				selected: false,
			},
		] as IDropdownOption[]
	}, [options, selectedKeys])
}

export function useOptionRenderer(
	options: MultiDropdownProps['options'],
	onSelectAllOrNone: MultiDropdownProps['onSelectAllOrNone'],
): IRenderFunction<ISelectableOption<any>> {
	const handleSelectAll = useCallback(
		() => onSelectAllOrNone?.(options),
		[onSelectAllOrNone, options],
	)
	const handleSelectNone = useCallback(
		() => onSelectAllOrNone?.([]),
		[onSelectAllOrNone],
	)

	const handleRenderOption: IRenderFunction<ISelectableOption<any>> =
		useCallback(
			option => {
				if (option?.data) {
					return (
						<Selector>
							<Link onClick={handleSelectAll}>All</Link>
							<Sep>|</Sep>
							<Link onClick={handleSelectNone}>None</Link>
						</Selector>
					)
				} else {
					return <span>{option?.text}</span>
				}
			},
			[handleSelectAll, handleSelectNone],
		)
	return handleRenderOption
}

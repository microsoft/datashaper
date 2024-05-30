/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import merge from 'lodash-es/merge.js'

import { EMPTY_ARRAY } from '../../../empty.js'

/**
 * Constructs a command for listing out items with checks
 * @param list - full list of items to display
 * @param checked - subset of items to display with checkbox
 * @param onCheckChange -
 * @param props - any override ICommandBarItemProps to overlay on the command
 * @returns
 */
export function checkedItemsCommand(
	list: string[],
	checked?: string[],
	onCheckChange?: (
		name: string,
		checked: boolean,
		index: number,
	) => boolean | void,
	props?: Partial<ICommandBarItemProps>,
): ICommandBarItemProps {
	const hash = (checked || EMPTY_ARRAY).reduce(
		(acc, cur) => {
			acc[cur] = true
			return acc
		},
		{} as Record<string, boolean>,
	)
	const items = list.map((name, index) => ({
		key: name,
		text: name,
		canCheck: true,
		checked: hash[name],
		onClick: (
			ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
			_item?: IContextualMenuItem,
		) => {
			ev?.preventDefault()
			return onCheckChange?.(name, !hash[name], index)
		},
	}))
	return merge(
		{
			key: 'checked-items',
			title: 'Choose items',
			iconProps: {
				iconName: 'MultiSelect',
			},
			subMenuProps: {
				items,
			},
		},
		props,
	)
}

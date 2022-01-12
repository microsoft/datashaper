/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ICommandBarItemProps } from '@fluentui/react'
import { merge } from 'lodash'

/**
 * Constructs a command for listing out items with checks
 * @param list - full list of items to display
 * @param checked - subset of items to display with checkbox
 * @param onCheckChange
 * @params props - any override ICommandBarItemProps to overlay on the command
 * @returns
 */
export function checkedItemsCommand(
	list: string[],
	checked?: string[],
	onCheckChange?: (name: string, checked: boolean) => void,
	props?: ICommandBarItemProps,
): ICommandBarItemProps {
	const click = (name: string, checked: boolean) => {
		onCheckChange && onCheckChange(name, checked)
	}
	const hash = (checked || []).reduce((acc, cur) => {
		acc[cur] = true
		return acc
	}, {} as Record<string, boolean>)
	const items = list.map(name => ({
		key: name,
		text: name,
		canCheck: true,
		checked: hash[name],
		onClick: () => click(name, !hash[name]),
	}))
	return merge(
		{
			key: 'checked-items',
			title: 'Select items',
			iconProps: {
				iconName: 'CheckMark',
			},
			subMenuProps: {
				items,
			},
		},
		props,
	)
}

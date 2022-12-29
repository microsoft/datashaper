/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHeaderCommandBarDefaults } from '@datashaper/react'
import type { ICommandBarItemProps, ICommandBarProps } from '@fluentui/react'
import { useMemo } from 'react'

import {
	buttonStyles,
	icons,
	useCommandBarStyles,
	useTableHeaderColors,
} from './ParserOptionsEditor.styles.js'
export function useOptionsButtonCommandBar(
	isCollapsed: boolean,
	toggleCollapsed: () => void,
): ICommandBarProps {
	const styles = useCommandBarStyles()
	const colors = useTableHeaderColors()
	const base = useMemo(
		() => ({
			items: [
				{
					key: 'optionsButton',
					id: 'optionsButton',
					disabled: !isCollapsed,
					iconProps: icons.settings,
					onClick: toggleCollapsed,
					buttonStyles,
				} as ICommandBarItemProps,
			],
			id: 'optionsButton',
			styles,
		}),
		[isCollapsed, toggleCollapsed, styles],
	)
	return useHeaderCommandBarDefaults(base, true, colors)
}

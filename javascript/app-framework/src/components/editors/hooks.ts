/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHeaderCommandBarDefaults } from '@datashaper/react'
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IIconProps,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useMemo } from 'react'

import {
	buttonStyles,
	useCommandBarStyles,
	useTableHeaderColors,
} from './styles.js'
/**
 * Creates state and config for a CommandBar that toggles the collapsed state of a ToolPanel.
 * @param isCollapsed
 * @param toggleCollapsed
 * @returns
 */
export function useToolPanelExpandCollapse(
	id: string,
	iconName: string,
	text?: string,
): {
	collapsed: boolean
	onToggleCollapsed: () => void
	commandBar: ICommandBarProps
	iconProps: IIconProps
} {
	const [collapsed, { toggle: onToggleCollapsed }] = useBoolean(true)
	const styles = useCommandBarStyles()
	const colors = useTableHeaderColors()
	const iconProps = useMemo(() => ({ iconName }), [iconName])
	const base = useMemo(
		() => ({
			items: [
				{
					key: id,
					id,
					disabled: !collapsed,
					iconProps,
					text,
					onClick: onToggleCollapsed,
					buttonStyles,
				} as ICommandBarItemProps,
			],
			id,
			styles,
		}),
		[id, iconProps, text, collapsed, onToggleCollapsed, styles],
	)
	const commandBar = useHeaderCommandBarDefaults(base, true, colors)
	return {
		collapsed,
		onToggleCollapsed,
		commandBar,
		iconProps,
	}
}

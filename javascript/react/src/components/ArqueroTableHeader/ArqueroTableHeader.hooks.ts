/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import type { CommandBarColors } from '../../types.js'

export function useColorDefaults(
	colors?: Partial<CommandBarColors>,
): CommandBarColors {
	const theme = useTheme()
	const defaults = useMemo(
		() =>
			({
				color: theme.palette.neutralPrimaryAlt,
				background: theme.palette.neutralQuaternary,
				disabled: theme.palette.neutralSecondaryAlt,
				border: theme.palette.neutralTertiaryAlt,
				checked: theme.palette.neutralTertiaryAlt,
				hovered: theme.palette.neutralTertiary,
				pressed: theme.palette.neutralQuaternaryAlt,
			} as CommandBarColors),
		[theme],
	)
	return useMemo(
		() => ({
			background: colors?.background || defaults.background,
			color: colors?.color || defaults.color,
			disabled: colors?.disabled || defaults.disabled,
			border: colors?.border || defaults.border,
			checked: colors?.checked || defaults.checked,
			hovered: colors?.hovered || defaults.hovered,
			pressed: colors?.pressed || defaults.pressed,
		}),
		[colors, defaults],
	)
}

export function useColumnCounts(
	table: ColumnTable,
	visibleColumns?: string[],
): {
	total: number
	visible: number
	hidden: number
} {
	return useMemo(() => {
		const total = table.numCols()
		const visible = visibleColumns ? visibleColumns.length : total
		const hidden = total - visible
		return {
			total,
			visible,
			hidden,
		}
	}, [table, visibleColumns])
}

export function useRowCounts(table: ColumnTable): {
	total: number
	visible: number
	hidden: number
} {
	return useMemo(() => {
		const total = table.totalRows()
		const visible = table.numRows()
		const hidden = total - visible
		return {
			total,
			visible,
			hidden,
		}
	}, [table])
}

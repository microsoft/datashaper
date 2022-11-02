/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

import type { CommandBarColors } from '../../types.js'

export function useCommandBarColorDefaults(
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

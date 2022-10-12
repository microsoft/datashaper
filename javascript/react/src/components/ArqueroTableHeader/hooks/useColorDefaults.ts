/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

import type { CommandBarColors } from '../../../types.js'

export function useColorDefaults(
	colors?: Partial<CommandBarColors>,
): CommandBarColors {
	const theme = useTheme()
	const defaults = useMemo(
		() =>
			({
				color: theme.palette.neutralPrimary,
				background: theme.palette.neutralQuaternary,
				disabled: theme.palette.neutralSecondary,
				border: theme.palette.neutralTertiaryAlt,
				checked: theme.palette.neutralQuaternaryAlt,
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
		}),
		[colors, defaults],
	)
}

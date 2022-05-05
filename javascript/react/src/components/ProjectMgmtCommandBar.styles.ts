import type { Theme } from '@thematic/core'
import { ThemeVariant } from '@thematic/core'

export const bgColor = (theme: Theme) =>
	theme.variant === ThemeVariant.Light
		? theme.application().highContrast().hex()
		: theme.application().lowContrast().hex()

export const color = (theme: Theme) =>
	theme.variant === ThemeVariant.Light
		? theme.application().lowContrast().hex()
		: theme.application().midHighContrast().hex()

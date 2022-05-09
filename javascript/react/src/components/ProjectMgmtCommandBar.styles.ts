/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import { ThemeVariant } from '@thematic/core'

export const bgColor = (theme: Theme): string =>
	theme.variant === ThemeVariant.Light
		? theme.application().highContrast().hex()
		: theme.application().lowContrast().hex()

export const color = (theme: Theme): string =>
	theme.variant === ThemeVariant.Light
		? theme.application().lowContrast().hex()
		: theme.application().midHighContrast().hex()

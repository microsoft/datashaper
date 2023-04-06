/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useFrameworkSettingsValue } from '@datashaper/app-framework'
import { loadById } from '@thematic/core'
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { memo, useMemo } from 'react'
import {
	createGlobalStyle,
	ThemeProvider as ThemeProviderRaw,
} from 'styled-components'

const ThemeProvider = ThemeProviderRaw as any

export const StyleContext: React.FC<
	React.PropsWithChildren<{
		/* nothing */
	}>
> = memo(function StyleContext({ children }) {
	const settings = useFrameworkSettingsValue()
	const theme = loadById('default', {
		dark: settings.darkMode,
	})
	const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])
	return (
		<>
			<GlobalStyle />
			<ThematicFluentProvider theme={theme} className="fluent-theme-provider">
				<ApplicationStyles />
				<ThemeProvider theme={fluentTheme}>{children}</ThemeProvider>
			</ThematicFluentProvider>
		</>
	)
})

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	html, body, .fluent-theme-provider {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
	}
` as any

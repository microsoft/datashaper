/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { memo, useMemo } from 'react'
import {
	createGlobalStyle,
	ThemeProvider as ThemeProviderRaw,
} from 'styled-components'

import { useTheme } from '../states/settings.js'

const ThemeProvider = ThemeProviderRaw as any

export const StyleContext: React.FC<
	React.PropsWithChildren<{
		/* nothing */
	}>
> = memo(function StyleContext({ children }) {
	const theme = useTheme()
	const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])

	return (
		<div className={'style-context'}>
			<GlobalStyle />
			<ThematicFluentProvider theme={theme}>
				<ApplicationStyles />
				<ThemeProvider theme={fluentTheme}>{children}</ThemeProvider>
			</ThematicFluentProvider>
		</div>
	)
})

const GlobalStyle = createGlobalStyle`
	html {
		height: 100%;
	}
	body {
		height: 100%;
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
` as any

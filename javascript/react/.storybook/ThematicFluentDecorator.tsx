import { initializeIcons } from '@fluentui/font-icons-mdl2'
import { useState, useCallback, useMemo } from 'react'
import { Toggle } from '@fluentui/react'
import { ThemeVariant, loadById } from '@thematic/core'
import { ApplicationStyles } from '@thematic/react'
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types'
import { ThemeProvider } from 'styled-components'

initializeIcons(undefined, { disableWarnings: true })
/**
 * ThematicFluentDecorator configures both Thematic and the Fluent wrapper
 * @param storyFn
 */
export const ThematicFluentDecorator = (
	storyFn: any,
): StoryFnReactReturnType => {
	const [dark, setDark] = useState(false)
	// load a non-standard theme, so it is obvious that it isn't the default
	// this helps identify problems with theme application in Fluent, which looks a lot like our default essex theme
	const thematicTheme = useMemo(
		() =>
			loadById('metal', {
				variant: dark ? ThemeVariant.Dark : ThemeVariant.Light,
			}),
		[dark],
	)
	const fluentTheme = useMemo(
		() => loadFluentTheme(thematicTheme),
		[thematicTheme],
	)
	const handleDarkChange = useCallback((e, v) => {
		setDark(v)
	}, [])

	return (
		<ThematicFluentProvider theme={thematicTheme}>
			<ThemeProvider theme={fluentTheme}>
				<ApplicationStyles />
				<Toggle label="Dark mode" checked={dark} onChange={handleDarkChange} />
				<div
					style={{
						borderTop: `1px solid ${thematicTheme.application().faint().hex()}`,
					}}
				>
					{storyFn(undefined, undefined)}
				</div>
			</ThemeProvider>
		</ThematicFluentProvider>
	)
}

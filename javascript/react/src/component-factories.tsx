/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarProps, ITheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import type { ReactElement } from 'react'

import { CommandBar } from './components/CommandBar.js'

const defStyles = {
	root: {
		height: 36,
	},
	primarySet: {
		width: '100%',
	},
}

/**
 * Creates a command bar styled to fit nicely in places like column headers.
 * @param props - the component props
 * @returns
 */
export function createDefaultCommandBar({
	styles,
	...props
}: ICommandBarProps): ReactElement<ICommandBarProps, any> {
	const defaultStyles = merge(defStyles, styles)
	return <CommandBar {...props} styles={defaultStyles} />
}

/**
 * Creates a header command bar using the inverted style for our default table header
 * @param props - the component props
 * @param theme - the theme
 * @param far - use far mode
 * @returns
 */
export function createDefaultHeaderCommandBar(
	{ styles, ...props }: ICommandBarProps,
	theme: ITheme,
	far = false,
): ReactElement<ICommandBarProps, any> {
	const defaultStyles = merge(
		{
			root: {
				display: 'flex',
				justifyContent: far ? 'flex-end' : 'flex-start',
			},
		},
		defStyles,
		{},
		styles,
	)
	const { background, color } = {
		background: theme.palette.themePrimary,
		color: theme.palette.white,
	}
	return (
		<CommandBar
			{...props}
			styles={defaultStyles}
			background={background}
			color={color}
		/>
	)
}

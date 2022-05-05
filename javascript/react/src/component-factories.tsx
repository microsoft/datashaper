/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GroupHeader } from '@data-wrangling-components/react-controls'
import type { ColumnMetadata } from '@essex/arquero'
import type {
	ICommandBarProps,
	IDetailsGroupDividerProps,
} from '@fluentui/react'
import type { Theme } from '@thematic/core'
import merge from 'lodash-es/merge.js'
import type { ReactElement } from 'react'

import { CommandBar } from './CommandBar/CommandBar.js'

export function createLazyLoadingGroupHeader(
	props: IDetailsGroupDividerProps | undefined,
	children: any,
	columnName?: string,
	columnMetadata?: ColumnMetadata | undefined,
): ReactElement<any, any> | null {
	if (!props || (!columnMetadata && !columnName)) {
		return null
	}
	return (
		<GroupHeader
			props={props}
			columnName={columnMetadata?.name || columnName}
			lazyLoadGroups
		>
			{children}
		</GroupHeader>
	)
}

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
	theme: Theme,
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
	const { bgColor, color } = {
		bgColor: theme.application().accent().hex(),
		color: theme.application().background().hex(),
	}
	return (
		<CommandBar
			{...props}
			styles={defaultStyles}
			bgColor={bgColor}
			color={color}
		/>
	)
}

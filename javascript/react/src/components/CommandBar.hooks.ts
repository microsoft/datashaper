/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonProps,
	ICommandBarItemProps,
	ICommandBarStyleProps,
	ICommandBarStyles,
	IIconProps,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import merge from 'lodash-es/merge.js'
import { useCallback, useMemo } from 'react'

/**
 * This hook just centralizes default command item styling for the header
 * @param commands -
 * @returns
 */
export function useCommands(
	commands: ICommandBarItemProps[] = [],
	background: string,
	color: string,
): ICommandBarItemProps[] {
	return useMemo(() => {
		return commands.map(command =>
			merge(
				{
					iconProps: {
						styles: {
							root: {
								color,
							},
						},
					},
					buttonStyles: {
						root: {
							background,
							color,
						},
						menuIcon: {
							color,
						},
					},
				},
				command,
			),
		)
	}, [commands, background, color])
}

export function useColorDefaults(
	color?: string,
	background?: string,
): {
	background: string
	foreground: string
} {
	const theme = useTheme()
	return useMemo(
		() => ({
			background: background || theme.palette.white,
			foreground: color || theme.palette.neutralPrimary,
		}),
		[theme, background, color],
	)
}

export function useHandleOnDataReduce(
	color: string,
): (item: ICommandBarItemProps) => void {
	const iconProps = useIconProps(color)
	return useCallback(
		item => {
			item.iconProps = iconProps(item)
			item.text = item.text || item.title || ''
		},
		[iconProps],
	)
}

export function useHandleOnDataGrown(
	color: string,
): (item: ICommandBarItemProps) => void {
	const iconProps = useIconProps(color)
	return useCallback(
		item => {
			item.iconProps = iconProps(item)
		},
		[iconProps],
	)
}

export function useOverflowButtonProps(
	background: string,
	color: string,
): IButtonProps {
	return useMemo(
		() => ({
			styles: {
				root: {
					background,
				},
				menuIcon: {
					color: color,
				},
			},
		}),
		[background, color],
	)
}

function useIconProps(
	color: string,
): (item: ICommandBarItemProps) => IIconProps {
	return useCallback(
		(item: ICommandBarItemProps) => ({
			styles: {
				root: {
					color,
				},
			},
			...item.iconProps,
		}),
		[color],
	)
}

export function useCommandStyles(
	styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>,
): ICommandBarStyles {
	return useMemo(
		() =>
			merge(
				{
					root: {
						width: '100%',
						background: 'none',
						padding: 0,
					},
				},
				styles,
			),
		[styles],
	)
}

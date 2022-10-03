/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps, ICommandBarStyles } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import chroma from 'chroma-js'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { ProjectManagementCommandBarProps } from '../components/ProjectManagementCommandBar.types.js'
/**
 * Helper to create the props necessary for the default inverted management bar.
 * Basic colors can be customized, but note that if you do not want an always-inverted
 * bar like that used in the DataShaper webapp, you may want to just tweak the Fluent
 * styles as normal.
 * @returns
 */
export function useManagementBarDefaults(
	props?: ProjectManagementCommandBarProps,
	colors?: {
		color?: string
		background?: string
		border?: string
	},
): ProjectManagementCommandBarProps {
	const styles = useBaseStyles(colors)
	const itemProps = useItemProps(colors)
	return useMemo(
		() =>
			merge(
				{
					styles,
					itemProps,
				},
				props,
			),
		[props, styles, itemProps],
	)
}

function useBaseStyles(colors?: {
	color?: string
	background?: string
	border?: string
}): ICommandBarStyles {
	const theme = useThematicFluent(true)
	const color = useMemo(
		() => colors?.color || theme.palette.neutralPrimaryAlt,
		[colors, theme],
	)
	const background = useMemo(
		() => colors?.background || theme.palette.neutralQuaternary,
		[colors, theme],
	)
	const border = useMemo(
		() => colors?.border || theme.palette.neutralTertiary,
		[colors, theme],
	)
	return useMemo(
		() => ({
			root: {
				height: 36,
				padding: 0,
				width: '100%',
				color,
				background,
				borderBottom: `1px solid ${border}`,
			},
		}),
		[color, background, border],
	)
}

function useItemProps(colors?: {
	color?: string
	background?: string
	border?: string
}): Partial<ICommandBarItemProps> {
	const theme = useThematicFluent(true)
	const color = useMemo(
		() => colors?.color || theme.palette.neutralPrimaryAlt,
		[colors, theme],
	)
	const background = useMemo(
		() => colors?.background || theme.palette.neutralQuaternary,
		[colors, theme],
	)
	const backgroundHovered = useMemo(
		() =>
			background
				? chroma(background).darken().hex()
				: theme.palette.neutralQuaternaryAlt,
		[background, theme],
	)
	return useMemo(
		() => ({
			buttonStyles: {
				root: {
					background,
					color,
				},
				rootHovered: {
					background: backgroundHovered,
					color,
				},
				rootExpandedHovered: {
					background: backgroundHovered,
					color,
				},
				label: {
					color,
				},
				icon: {
					color,
				},
				iconHovered: {
					color,
				},
				menuIcon: {
					color,
				},
				menuIconHovered: {
					color,
				},
			},
		}),
		[color, background, backgroundHovered],
	)
}

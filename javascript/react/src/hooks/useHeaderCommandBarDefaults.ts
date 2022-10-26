/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	ICommandBarStyleProps,
	ICommandBarStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import chroma from 'chroma-js'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { DEFAULT_HEIGHT } from '../components/ArqueroTableHeader/ArqueroTableHeader.constants.js'
import { useColorDefaults } from '../components/ArqueroTableHeader/hooks/useColorDefaults.js'
import type { CommandBarColors } from '../types.js'

/**
 * Helper to create the props necessary for the default inverted management bar.
 * Basic colors can be customized, but note that if you do not want an always-inverted
 * bar like that used in the DataShaper webapp, you may want to just tweak the Fluent
 * styles as normal.
 * @returns
 */
export function useHeaderCommandBarDefaults(
	props?: Partial<ICommandBarProps>,
	far = false,
	colors?: Partial<CommandBarColors>,
): ICommandBarProps {
	const base = useBaseProps(far, colors, props?.styles)
	const items = useItems(props?.items, colors)
	return useMemo(
		() =>
			merge(base, props, {
				items,
			}),
		[props, base, items],
	)
}

function useBaseProps(
	far: boolean,
	colors?: Partial<CommandBarColors>,
	styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>,
): Partial<ICommandBarProps> {
	const { color, background } = useColorDefaults(colors)
	return useMemo(
		() => ({
			styles: merge(
				{
					root: {
						height: DEFAULT_HEIGHT,
						padding: 0,
						display: 'flex',
						justifyContent: far ? 'flex-end' : 'flex-start',
						width: '100%',
						color,
						background,
					},
				},
				styles,
			),
			overflowButtonProps: {
				styles: {
					root: {
						background,
					},
					menuIcon: {
						color,
					},
				},
			},
		}),
		[styles, far, color, background],
	)
}

function useItems(
	items: ICommandBarItemProps[] = [],
	colors?: Partial<CommandBarColors>,
): ICommandBarItemProps[] {
	const theme = useTheme()
	const color = useMemo(
		() => colors?.color || theme.palette.neutralPrimaryAlt,
		[colors, theme],
	)
	const disabled = useMemo(
		() => colors?.color || theme.palette.neutralTertiary,
		[colors, theme],
	)
	const background = useMemo(
		() => colors?.background || theme.palette.neutralQuaternary,
		[colors, theme],
	)
	const backgroundHovered = useMemo(
		() => chroma(background).darken().hex(),
		[background],
	)
	const checked = useMemo(
		() => colors?.checked || chroma(background).darken().hex(),
		[colors, background],
	)
	const styles = useMemo(
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
				rootChecked: {
					background: checked,
				},
				label: {
					color,
				},
				labelDisabled: {
					color: disabled,
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
		[color, background, backgroundHovered, checked, disabled],
	)
	return useMemo(
		() => items.map(item => merge({}, styles, item)),
		[items, styles],
	)
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps, ICommandBarProps } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import chroma from 'chroma-js'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

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
	props?: ICommandBarProps,
	far = false,
	colors?: Partial<CommandBarColors>,
): ICommandBarProps {
	const base = useBaseProps(far, colors)
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
): Partial<ICommandBarProps> {
	const { color, background } = useColorDefaults(colors)
	return useMemo(
		() => ({
			styles: {
				root: {
					height: 36,
					padding: 0,
					display: 'flex',
					justifyContent: far ? 'flex-end' : 'flex-start',
					width: '100%',
					color,
					background,
				},
			},
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
		[far, color, background],
	)
}

function useItems(
	items: ICommandBarItemProps[] = [],
	colors?: Partial<CommandBarColors>,
): ICommandBarItemProps[] {
	const theme = useThematicFluent()
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
		() =>
			background
				? chroma(background).darken().hex()
				: theme.palette.neutralQuaternaryAlt,
		[background, theme],
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
		[color, background, backgroundHovered, disabled],
	)
	return useMemo(
		() => items.map(item => merge({}, styles, item)),
		[items, styles],
	)
}

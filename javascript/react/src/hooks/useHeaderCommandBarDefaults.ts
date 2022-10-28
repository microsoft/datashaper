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
	const buttonStyles = useDefaultButtonStyles(colors)
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
				styles: buttonStyles,
			},
		}),
		[styles, far, color, background, buttonStyles],
	)
}

function useItems(
	items: ICommandBarItemProps[] = [],
	colors?: Partial<CommandBarColors>,
): ICommandBarItemProps[] {
	const buttonStyles = useDefaultButtonStyles(colors)
	return useMemo(
		() => items.map(item => merge({}, { buttonStyles }, item)),
		[items, buttonStyles],
	)
}

function useDefaultButtonStyles(colors?: Partial<CommandBarColors>) {
	const defaults = useColorDefaults(colors)
	const { color, background, disabled, hovered, checked } = defaults
	return useMemo(
		() => ({
			root: {
				background,
				color,
			},
			rootDisabled: {
				color: disabled,
			},
			rootHovered: {
				background: hovered,
				color,
			},
			rootExpandedHovered: {
				background: hovered,
				color,
			},
			rootExpanded: {
				background: hovered,
			},
			rootPressed: {
				background: hovered,
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
			iconDisabled: {
				color: disabled,
			},
			iconHovered: {
				color,
			},
			iconPressed: {
				color,
			},
			menuIcon: {
				color,
			},
			menuIconHovered: {
				color,
			},
			menuIconDisabled: {
				color: disabled,
			},
		}),
		[color, background, hovered, checked, disabled],
	)
}

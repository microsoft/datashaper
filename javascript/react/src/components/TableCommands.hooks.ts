/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Verb } from '@datashaper/schema'
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IContextualMenuItem,
} from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import upperFirst from 'lodash-es/upperFirst.js'
import { useMemo } from 'react'

import { createDefaultHeaderCommandBar } from '../component-factories.js'
import { getVerbIcon } from '../verbIcons.js'

const mainColumnVerbs = [Verb.Bin, Verb.Binarize, Verb.Filter, Verb.Aggregate]

const groupedColumnVerbs = [
	{
		label: 'Aggregates',
		verbs: ['pivot', 'rollup', 'unroll', 'window'],
	},
	{
		label: 'Transform column',
		verbs: ['convert', 'erase', 'fill', 'impute', 'recode'],
	},
	{
		label: 'Combine columns',
		verbs: ['fold', 'unfold', 'onehot', 'unhot', 'spread'],
	},
]

function getOverflowVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
): ICommandBarItemProps[] {
	return groupedColumnVerbs.map(group => ({
		key: `__section-${group.label}__`,
		itemType: ContextualMenuItemType.Section,
		disabled,
		sectionProps: {
			topDivider: true,
			title: group.label,
			items: group.verbs.map(verb => {
				const found = Object.entries(Verb).find(v => v[1] === verb)!
				return {
					key: found[1],
					text: found[0],
					onClick: onCallStep,
					data: { submenu: true },
					disabled,
				}
			}),
		},
	}))
}

function getMainVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
): ICommandBarItemProps[] {
	return mainColumnVerbs.map(verb => {
		return {
			key: verb,
			text: upperFirst(verb),
			id: verb,
			iconProps: { iconName: getVerbIcon(verb) },
			onClick: onCallStep,
			disabled,
		}
	})
}

export function useTableCommands(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
): React.ReactElement<ICommandBarProps, any> {
	const theme = useThematic()

	return useMemo(() => {
		return createDefaultHeaderCommandBar(
			{
				items: getMainVerbItems(onCallStep, disabled),
				overflowItems: getOverflowVerbItems(onCallStep, disabled),
				id: 'groupedMenu',
			},
			theme,
		)
	}, [onCallStep, theme, disabled])
}

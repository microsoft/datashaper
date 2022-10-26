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
import { ContextualMenuItemType, VerticalDivider } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import uniqueId from 'lodash-es/uniqueId.js'
import upperFirst from 'lodash-es/upperFirst.js'
import { useMemo } from 'react'

import { useHeaderCommandBarDefaults } from '../hooks/useHeaderCommandBarDefaults.js'
import { getVerbIcon } from '../verbIcons.js'
import type { GroupedVerbs } from './TableCommands.types.js'
import {
	groupedColumnVerbs,
	groupedTableVerbs,
	mainColumnVerbs,
	mainTableVerbs,
} from './TableCommands.utils.js'

function getOverflowVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
	verbList: GroupedVerbs[],
	id: string,
): ICommandBarItemProps[] {
	return verbList.map(group => ({
		key: `__section-${group.label}__`,
		itemType: ContextualMenuItemType.Section,
		sectionProps: {
			topDivider: true,
			title: group.label,
			items: group.verbs.map(verb => {
				const found = Object.entries(Verb).find(v => v[1] === verb)!
				return {
					key: found[1],
					text: found[0],
					onClick: onCallStep,
					data: { id },
					disabled: group?.alwaysEnabled ? false : disabled,
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
	verbList: Verb[],
	disabled: boolean,
): ICommandBarItemProps[] {
	const items = [
		{
			key: 'divider' + uniqueId(),
			id: 'divider' + uniqueId(),
			commandBarButtonAs: VerticalDivider,
			buttonStyles: { wrapper: { padding: '8px 2px', height: '100%' } },
			itemType: ContextualMenuItemType.Divider,
		} as ICommandBarItemProps,
	]
	verbList.forEach(verb => {
		items.push({
			key: verb,
			text: upperFirst(verb),
			id: verb,
			iconProps: { iconName: getVerbIcon(verb) },
			onClick: onCallStep,
			disabled,
		} as ICommandBarItemProps)
	})

	return items
}

export function useColumnCommands(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
	color?: string,
	background?: string,
	baseProps?: Partial<ICommandBarProps>,
): ICommandBarProps {
	const base = useMemo(() => {
		const id = 'overflowColumn'
		return merge(
			{
				items: getMainVerbItems(onCallStep, mainColumnVerbs, disabled),
				overflowItems: getOverflowVerbItems(
					onCallStep,
					disabled,
					groupedColumnVerbs,
					id,
				),
				id,
			},
			baseProps,
		)
	}, [onCallStep, disabled, baseProps])
	return useHeaderCommandBarDefaults(base, false, { color, background })
}

export function useTableCommands(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
	color?: string,
	background?: string,
	baseProps?: Partial<ICommandBarProps>,
): ICommandBarProps {
	const base = useMemo(() => {
		const id = 'overflowTable'
		return merge(
			{
				items: getMainVerbItems(onCallStep, mainTableVerbs, disabled),
				overflowItems: getOverflowVerbItems(
					onCallStep,
					disabled,
					groupedTableVerbs,
					id,
				),
				id,
			},
			baseProps,
		)
	}, [onCallStep, disabled, baseProps])
	return useHeaderCommandBarDefaults(base, false, { color, background })
}

export function useUndoCommands(
	onUndoStep: () => void,
	disabled: boolean,
	color?: string,
	background?: string,
	baseProps?: Partial<ICommandBarProps>,
): ICommandBarProps {
	const base = useMemo(
		() =>
			merge(
				{
					items: [
						{
							key: 'undo',
							iconOnly: true,
							iconProps: icons.undo,
							title: 'Undo last step',
							onClick: onUndoStep,
							disabled,
						},
					],
					styles: {
						root: {
							width: 40,
						},
					},
				},
				baseProps,
			),
		[onUndoStep, disabled, baseProps],
	)
	return useHeaderCommandBarDefaults(base, false, { color, background })
}

const icons = {
	undo: { iconName: 'Undo' },
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { type Verb } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import { type Step, isDataTypeSupported } from '@datashaper/workflow'
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IContextualMenuItem,
} from '@fluentui/react'
import { ContextualMenuItemType, VerticalDivider } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import uniqueId from 'lodash-es/uniqueId.js'
import upperFirst from 'lodash-es/upperFirst.js'
import { useCallback, useMemo } from 'react'

import type { ModalState } from '../../hooks/index.js'
import {
	useHeaderCommandBarDefaults,
	useModalState,
} from '../../hooks/index.js'
import type { GroupedVerbs } from './TableCommands.types.js'
import {
	groupedColumnVerbs,
	groupedTableVerbs,
	mainColumnVerbs,
	mainTableVerbs,
} from './TableCommands.utils.js'
import { getVerbIcon } from './verbIcons.js'

function collapseScopedVerbs(verbs: string[]): Record<string, string | object> {
	// note the handling of the accumulated package scopes to retain the full package name as we recurse
	function walk(list: string[], container: any, pkg: string[] = []) {
		list.forEach((name) => {
			const parts = name.split('.')
			if (parts.length === 1) {
				container[name] = [...pkg, name].join('.')
			} else {
				const [scope, ...rest] = parts as [string, ...string[]]
				if (!container[scope]) {
					container[scope] = {}
				}
				walk([rest.join('.')], container[scope], [...pkg, scope])
			}
		})
		return container
	}
	return walk(verbs, {})
}

function getOverflowTableVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
	verbList: GroupedVerbs[],
	id: string,
): ICommandBarItemProps[] {
	function walk(verbs: any, disabled: boolean, click: any) {
		return Object.entries(verbs).map(([key, value]) => {
			const item: ICommandBarItemProps = {
				key,
				text: upperFirst(key),
				data: { id },
				disabled,
			}
			if (typeof value === 'string') {
				item.key = value
				item.onClick = click
			} else {
				item.subMenuProps = {
					items: walk(value, disabled, click),
				}
			}
			return item
		})
	}

	return verbList.map((group) => {
		// collapse scoped verbs into a tree for hierarchical submenus
		const verbs = collapseScopedVerbs(group.verbs)
		const menu = {
			key: `__section-${group.label}__`,
			itemType: ContextualMenuItemType.Section,
			sectionProps: {
				topDivider: true,
				title: group.label,
				items: walk(verbs, group?.alwaysEnabled ? false : disabled, onCallStep),
			},
		}
		return menu
	})
}

function getOverflowColumnVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	disabled: boolean,
	verbList: GroupedVerbs[],
	id: string,
	selectedColumn?: string,
	metadata?: TableMetadata,
): ICommandBarItemProps[] {
	function walk(verbs: any, disabled: boolean, click: any) {
		return Object.entries(verbs).map(([key, value]) => {
			// TODO: it would be really nice to disable the parent menu if all submenu items are disabled
			const enabled = shouldColumnVerbBeEnabled(
				value as Verb,
				disabled,
				selectedColumn,
				metadata,
			)
			const item: ICommandBarItemProps = {
				key,
				text: upperFirst(key),
				data: { id },
				disabled: !enabled,
			}
			if (typeof value === 'string') {
				item.key = value
				item.onClick = click
			} else {
				item.subMenuProps = {
					items: walk(value, disabled, click),
				}
			}
			return item
		})
	}

	return verbList.map((group) => {
		// collapse scoped verbs into a tree for hierarchical submenus
		const verbs = collapseScopedVerbs(group.verbs)
		const menu = {
			key: `__section-${group.label}__`,
			itemType: ContextualMenuItemType.Section,
			sectionProps: {
				topDivider: true,
				title: group.label,
				items: walk(verbs, group?.alwaysEnabled ? false : disabled, onCallStep),
			},
		}
		return menu
	})
}

function getMainTableVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	verbList: Verb[],
	disabled: boolean,
): ICommandBarItemProps[] {
	const items = [dividerItem()]
	verbList.forEach((verb) => {
		items.push(itemTemplate(verb, disabled, onCallStep))
	})
	return items
}

function getMainColumnVerbItems(
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
	verbList: Verb[],
	disabled: boolean,
	selectedColumn?: string,
	metadata?: TableMetadata,
): ICommandBarItemProps[] {
	const items = [dividerItem()]
	verbList.forEach((verb) => {
		const enabled = shouldColumnVerbBeEnabled(
			verb,
			disabled,
			selectedColumn,
			metadata,
		)
		items.push(itemTemplate(verb, !enabled, onCallStep))
	})
	return items
}

function dividerItem() {
	return {
		key: `divider${uniqueId()}`,
		id: `divider${uniqueId()}`,
		commandBarButtonAs: VerticalDivider,
		buttonStyles: { wrapper: { padding: '8px 2px', height: '100%' } },
		itemType: ContextualMenuItemType.Divider,
	} as ICommandBarItemProps
}

function itemTemplate(
	verb: Verb,
	disabled: boolean,
	onCallStep: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => void,
) {
	return {
		key: verb,
		text: upperFirst(verb),
		id: verb,
		iconProps: { iconName: getVerbIcon(verb) },
		onClick: onCallStep,
		disabled,
	} as ICommandBarItemProps
}

// this function checks a verbs tags against the selected column's data type to determine if it should be operational
function shouldColumnVerbBeEnabled(
	verb: Verb,
	disabled: boolean,
	selectedColumn?: string,
	metadata?: TableMetadata,
) {
	// explicit disabled always overrides type checks
	// also automatically disabled if no column is selected, since these require an input column
	if (disabled || !selectedColumn) {
		return false
	}
	return isDataTypeSupported(verb, metadata?.columns[selectedColumn]?.type)
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
	selectedColumn?: string,
	metadata?: TableMetadata,
): ICommandBarProps {
	const base = useMemo(() => {
		const id = 'overflowColumn'
		return merge(
			{
				items: getMainColumnVerbItems(
					onCallStep,
					mainColumnVerbs,
					disabled,
					selectedColumn,
					metadata,
				),
				overflowItems: getOverflowColumnVerbItems(
					onCallStep,
					disabled,
					groupedColumnVerbs,
					id,
					selectedColumn,
					metadata,
				),
				id,
			},
			baseProps,
		)
	}, [onCallStep, selectedColumn, disabled, metadata, baseProps])
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
				items: getMainTableVerbItems(onCallStep, mainTableVerbs, disabled),
				overflowItems: getOverflowTableVerbItems(
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

export function useTransformModalState(
	setStep: (step: Step | undefined) => void,
	setStepIndex: (index: number | undefined) => void,
): ModalState {
	const onDismiss = useCallback(() => {
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex])
	return useModalState(undefined, onDismiss)
}

const icons = {
	undo: { iconName: 'Undo' },
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TreeGroup, TreeItem } from '@essex/components'
import { useMemo } from 'react'

import type { ResourceRoute, ResourceRouteGroup } from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'
import { FieldWell } from './FieldWell.js'

/**
 * Extract the grouping instructions for the Tree component.
 * @param groups
 * @returns
 */
export function useTreeGroups(
	groups: ResourceRouteGroup[],
	narrow = false,
): TreeGroup[] {
	return useMemo(
		() => groups.map((g) => ({ key: g.type, text: groupName(g, narrow) })),
		[groups, narrow],
	)
}

function groupName(group: ResourceRouteGroup, narrow = false): string {
	switch (group.type) {
		case ResourceGroupType.Data:
			return narrow ? 'Data' : 'Data files'
		default:
			return narrow ? 'Apps' : 'Analysis apps'
	}
}

/**
 * Extract a flat list of TreeItems for the Tree, with each assigned to a group
 * that aligns with the grouping instructions.
 * @param groups
 * @returns
 */
export function useTreeItems(
	groups: ResourceRouteGroup[],
	onSelect?: (v: ResourceRoute) => void,
	narrow?: boolean,
): TreeGroup[] {
	return useMemo(
		() =>
			groups.flatMap((group) =>
				group.resources.map((resource) =>
					makeTreeItem(resource, group.type, onSelect, narrow),
				),
			),
		[groups, onSelect, narrow],
	)
}

function makeTreeItem(
	resource: ResourceRoute,
	group?: ResourceGroupType,
	onSelect?: (v: ResourceRoute) => void,
	narrow?: boolean,
): TreeItem {
	// field well should be
	// (a) rendered if empty, so that options can be selected, and
	// (b) rendered _in place of_ the child resource, so we don't have redundant child entries.
	// so:
	// 1: iterate the field wells if present, creating a tree item for each. these should have no href, so are "unclickable"
	// 1.1: if any well has a selected key, then we don't need to render the child resource, save it for later
	// 2: iterate the child resources and create an item for each one that isn't already marked from the wells
	const handled = new Set<string>()
	const wellItems: TreeItem[] =
		resource.fieldWells?.map((well) => {
			const route = well.selectedKey
				? resource.children?.find((r) => r.key === well.selectedKey)
				: undefined
			if (well.selectedKey) {
				handled.add(well.selectedKey)
			}
			return {
				key: route?.href || `empty-field-well-${well.key}`,
				iconName: well.icon,
				text: well.title,
				onRenderTitle: () => {
					const handleClick = route ? () => onSelect?.(route) : undefined
					return (
						<div
							style={{
								width: '100%',

								padding: '4px 0',
								cursor: handleClick ? 'pointer' : 'default',
							}}
							onClick={handleClick}
						>
							<FieldWell field={well} />
						</div>
					)
				},
			}
		}) || []
	const children = [
		...wellItems,
		...(resource.children
			?.filter((c) => !handled.has(c.key))
			.map((c) => makeTreeItem(c, group, onSelect, narrow)) || []),
	]
	return {
		// TODO: is this no-href valid?
		key: resource.href ?? 'no-href',
		text: resource.title,
		iconName: resource.icon,
		group,
		children: children.length > 0 ? children : undefined,
		menuItems: resource.menuItems,
		onClick: () => onSelect?.(resource),
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	INavLink,
	INavLinkGroup,
} from '@fluentui/react'
import { useMemo } from 'react'

import type { ResourceRoute } from '../../../types.js'

export function useNavGroups(
	resources: ResourceRoute[][],
	onSelect: (v: ResourceRoute) => void,
): INavLinkGroup[] {
	return useMemo<INavLinkGroup[]>(() => {
		const result: INavLinkGroup[] = []

		for (const group of resources) {
			const links: INavLink[] = []
			for (const resource of group) {
				links.push(makeNavLink(resource, onSelect))
			}
			result.push({ links })
		}

		return result
	}, [resources, onSelect])
}

function makeNavLink(
	resource: ResourceRoute,
	onSelect: (v: ResourceRoute) => void,
): INavLink & { menuItems?: IContextualMenuItem[] } {
	const numChildren = resource.children?.length ?? 0

	return {
		name: resource.title,
		iconProps: {
			iconName: resource.icon,
			styles: { root: { marginLeft: 25 } },
		},
		url: '',
		icon: numChildren > 0 ? undefined : resource.icon,
		key: resource.href,
		links: resource.children?.map(c => makeNavLink(c, onSelect)),
		menuItems: resource.menuItems,
		onClick: () => onSelect(resource),
	}
}

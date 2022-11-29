/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	INavLink,
	IRenderFunction,
} from '@fluentui/react'
import { Nav } from '@fluentui/react'
import { memo } from 'react'

import { useNavGroups } from './ResourceTree.hooks.js'
import type { ResourceTreeProps } from './ResourceTree.types.js'
import { TreeLink } from './TreeLink.js'

export const ResourceTree: React.FC<ResourceTreeProps> = memo(
	function ResourceTree({ resources, selectedRoute, onSelect }) {
		const navGroups = useNavGroups(resources, onSelect)

		return (
			<Nav
				groups={navGroups}
				selectedKey={selectedRoute}
				onRenderLink={renderLink}
			/>
		)
	},
)
const renderLink: IRenderFunction<INavLink> = (
	props?: INavLink & { menuItems?: IContextualMenuItem[] },
	defaultRender?: (props?: INavLink | undefined) => JSX.Element | null,
): JSX.Element | null => (
	<TreeLink menuItems={props?.menuItems}>
		{defaultRender?.(props) ?? null}
	</TreeLink>
)

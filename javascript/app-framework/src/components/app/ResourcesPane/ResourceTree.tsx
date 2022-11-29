/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { INavLink, IRenderFunction} from '@fluentui/react';
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
const renderLink: IRenderFunction<INavLink> = function renderLink(
	props?: INavLink,
	defaultRender?: (props?: INavLink | undefined) => JSX.Element | null,
): JSX.Element | null {
	const result = defaultRender?.(props) ?? null
	return <TreeLink>{result}</TreeLink>
}

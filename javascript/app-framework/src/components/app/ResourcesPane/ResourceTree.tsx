/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tree } from '@essex/components'
import { memo } from 'react'

import { useTreeGroups, useTreeItems } from './ResourceTree.hooks.js'
import { treeStyles } from './ResourceTree.styles.js'
import type { ResourceTreeProps } from './ResourceTree.types.js'

export const ResourceTree: React.FC<ResourceTreeProps> = memo(
	function ResourceTree({ resources, selectedRoute, onSelect, expanded }) {
		const groups = useTreeGroups(resources, expanded)
		const items = useTreeItems(resources, onSelect)
		console.log(resources)
		return (
			<Tree
				groups={groups}
				items={items}
				selectedKey={selectedRoute}
				narrow={!expanded}
				styles={treeStyles}
			/>
		)
	},
)

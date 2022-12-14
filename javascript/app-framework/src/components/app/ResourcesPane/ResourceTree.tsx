/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tree } from '@essex/components'
import { memo } from 'react'

import { useTreeGroups, useTreeItems } from './ResourceTree.hooks.js'
import type { ResourceTreeProps } from './ResourceTree.types.js'

export const ResourceTree: React.FC<ResourceTreeProps> = memo(
	function ResourceTree({ resources, selectedRoute, onSelect }) {
		const groups = useTreeGroups(resources)
		const items = useTreeItems(resources, onSelect)
		return <Tree groups={groups} items={items} selectedKey={selectedRoute} />
	},
)

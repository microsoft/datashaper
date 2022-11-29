/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Nav } from '@fluentui/react'
import { memo } from 'react'

import { useNavGroups } from './ResourceTree.hooks.js'
import type { ResourceTreeProps } from './ResourceTree.types.js'

export const ResourceTree: React.FC<ResourceTreeProps> = memo(
	function ResourceTree({ resources, selectedRoute, onSelect }) {
		const navGroups = useNavGroups(resources, onSelect)
		return <Nav groups={navGroups} selectedKey={selectedRoute} />
	},
)

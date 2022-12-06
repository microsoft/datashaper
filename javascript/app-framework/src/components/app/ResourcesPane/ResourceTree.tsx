/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tree } from '@essex/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useItemClick, useTreeGroups } from './ResourceTree.hooks.js'
import type { ResourceTreeProps } from './ResourceTree.types.js'

export const ResourceTree: React.FC<ResourceTreeProps> = memo(
	function ResourceTree({ resources, selectedRoute, onSelect }) {
		const groups = useTreeGroups(resources)
		const onItemClick = useItemClick(resources, onSelect)
		return (
			<Container>
				{groups.map((group, index) => (
					<Tree
						key={`tree-group-${index}`}
						items={group}
						selectedKey={selectedRoute}
						onItemClick={onItemClick}
					/>
				))}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`

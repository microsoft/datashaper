/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuListProps } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import type { GroupedContextualMenuItems } from './StepSelector.types.js'

export interface GroupedMenuProps {
	groups: GroupedContextualMenuItems
	menuListProps: IContextualMenuListProps
}

export const GroupedMenu: React.FC<GroupedMenuProps> = memo(
	function GroupedMenu({ groups, menuListProps }) {
		return (
			<MenuLayout>
				{Object.entries(groups).map(([label, items]) => {
					return (
						<Column key={`verb-group-${label}`}>
							<ColumnHeader>{label}</ColumnHeader>
							{items.map(item =>
								menuListProps.defaultMenuItemRenderer(item as any),
							)}
						</Column>
					)
				})}
			</MenuLayout>
		)
	},
)

const MenuLayout = styled.div`
	display: flex;
	padding: 8px 0 8px 0;
	gap: 12px;
`

const Column = styled.div``

const ColumnHeader = styled.div`
	padding: 0 12px 0 12px;
	margin-bottom: 8px;
	font-weight: bold;
	color: ${({ theme }) => theme.application().accent().hex()};
`

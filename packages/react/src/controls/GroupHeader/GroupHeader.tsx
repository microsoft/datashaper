/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { IconButton, IDetailsGroupDividerProps, IGroup } from '@fluentui/react'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useIntersection } from 'src/ArqueroDetailsList'
import styled from 'styled-components'

interface GroupHeaderProps {
	columnMeta: ColumnMetadata
	props: IDetailsGroupDividerProps
}

export const GroupHeader: React.FC<GroupHeaderProps> = memo(
	function GroupHeader({ columnMeta, props }) {
		const { group, onToggleCollapse } = props
		const ref = useRef<HTMLDivElement>()
		// whether the element toggle is manual or by visibility on scroll
		const [manual, setManual] = useState(false)

		// trigger as soon as the element becomes visible
		const inViewport = useIntersection(ref.current, '0px')

		const countChildren = useCallback((children: IGroup[]) => {
			let total = 0
			children.forEach(child => {
				total += child.count
				total += child.children ? countChildren(child.children) : 0
			})
			return total
		}, [])

		useEffect(() => {
			if (inViewport && group?.isCollapsed && !manual && onToggleCollapse) {
				onToggleCollapse(group as IGroup)
			}
		}, [inViewport, group, onToggleCollapse, manual])

		const onManualLevelToggle = useCallback(() => {
			setManual(true)
			onToggleCollapse && onToggleCollapse(group as IGroup)
		}, [group, onToggleCollapse, setManual])

		return (
			<HeaderContainer
				ref={(element: HTMLDivElement) =>
					(ref.current = (group?.level as number) > 0 ? element : undefined)
				}
				groupLevel={group?.level as number}
			>
				<LevelButton
					onClick={onManualLevelToggle}
					iconProps={{
						iconName: group?.isCollapsed ? 'ChevronRight' : 'ChevronDown',
					}}
				></LevelButton>
				<HeaderDetailsText>
					<Bold>{`${columnMeta?.name} - ${group?.name}` || group?.name}</Bold>
				</HeaderDetailsText>
				<HeaderDetailsText>Children: {group?.count}</HeaderDetailsText>
				{group?.children && (
					<HeaderDetailsText>
						Total Items: {countChildren(group?.children)}
					</HeaderDetailsText>
				)}
			</HeaderContainer>
		)
	},
)

const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 8px;
`

const LevelButton = styled(IconButton)`
	width: 5%;
`

const HeaderDetailsText = styled.span`
	align-self: center;
`

const Bold = styled.b``

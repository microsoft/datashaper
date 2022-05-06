/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IGroup } from '@fluentui/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { useCountChildren, useIntersection } from './GroupHeader.hooks.js'
import type { GroupHeaderProps } from './GroupHeader.types.js'
import {
	Bold,
	HeaderContainer,
	HeaderDetailsText,
	LevelButton,
} from './GroupHeader.styles.js'

export const GroupHeader: React.FC<React.PropsWithChildren<GroupHeaderProps>> =
	memo(function GroupHeader({ columnName, props, children, lazyLoadGroups }) {
		const { group, onToggleCollapse } = props
		const ref = useRef<HTMLDivElement>()
		// whether the element toggle is manual or by visibility on scroll
		const [manualToggle, setManualToggle] = useState(false)

		// trigger as soon as the element becomes visible
		const inViewport = useIntersection(ref.current, '0px')
		const countChildren = useCountChildren()

		useEffect(() => {
			if (inViewport && group?.isCollapsed) {
				onToggleCollapse?.(group)
			}
		}, [inViewport, group, onToggleCollapse])

		const onManualLevelToggle = useCallback(() => {
			setManualToggle(true)
			onToggleCollapse?.(group as IGroup)
		}, [group, onToggleCollapse, setManualToggle])

		const shouldLazyLoad = useMemo((): boolean => {
			return lazyLoadGroups && (group?.level as number) > 0 && !manualToggle
		}, [group, lazyLoadGroups, manualToggle])

		return (
			<HeaderContainer
				// uses the ref to toggle if element is into view if the user didn't toggled it with the button
				ref={(element: HTMLDivElement) =>
					(ref.current = shouldLazyLoad ? element : undefined)
				}
				groupLevel={group?.level as number}
			>
				<LevelButton
					onClick={onManualLevelToggle}
					iconProps={{
						iconName: group?.isCollapsed ? 'ChevronRight' : 'ChevronDown',
					}}
				></LevelButton>
				<If condition={!!children}>
					<Then>{children}</Then>
					<Else>
						<HeaderDetailsText>
							<Bold>
								{columnName ? `${columnName}  - ` : ''}
								{group?.name}
							</Bold>
						</HeaderDetailsText>
						<HeaderDetailsText>Children: {group?.count}</HeaderDetailsText>
						{group?.children && (
							<HeaderDetailsText>
								Total Items: {countChildren(group?.children)}
							</HeaderDetailsText>
						)}
					</Else>
				</If>
			</HeaderContainer>
		)
	})

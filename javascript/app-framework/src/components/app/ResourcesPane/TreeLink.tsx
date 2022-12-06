/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu } from '@fluentui/react'
import { memo, useRef } from 'react'

import { useOnOutsideClick } from '../../../hooks/index.js'
import { useMenuShowState } from './TreeLink.hooks.js'
import { Container, HoverIcon } from './TreeLink.styles.js'
import type { TreeLinkProps } from './TreeLink.types.js'

export const TreeLink: React.FC<TreeLinkProps> = memo(function TreeLink({
	children,
	menuItems,
}) {
	const menuRef = useRef<HTMLDivElement>(null)
	const itemRef = useRef<HTMLDivElement>(null)
	const { isHidden, onToggle, onClose } = useMenuShowState()
	const numMenuItems = menuItems?.length ?? 0

	useOnOutsideClick(itemRef, onClose)
	return (
		<Container ref={itemRef}>
			{children}
			{numMenuItems > 0 && (
				<div ref={menuRef}>
					<HoverIcon className="hoverIcon" iconName="More" onClick={onToggle} />
					<ContextualMenu
						items={menuItems!}
						hidden={isHidden}
						target={menuRef}
					/>
				</div>
			)}
		</Container>
	)
})

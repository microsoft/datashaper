/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react';
import { ContextualMenu } from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import { memo, useRef } from 'react'

import { useOnOutsideClick } from '../../../hooks/index.js'
import { useMenuShowState } from './TreeLink.hooks.js'
import { Container, HoverIcon } from './TreeLink.styles.js'

export interface TreeLinkProps {
	children: React.ReactNode
}

export const TreeLink: React.FC<TreeLinkProps> = memo(function TreeLink({
	children,
}) {
	const menuRef = useRef<HTMLDivElement>(null)
	const itemRef = useRef<HTMLDivElement>(null)
	const menu = useConst<IContextualMenuItem[]>([
		{ key: 'new', text: 'New item' },
	])
	const { isHidden, onToggle, onClose } = useMenuShowState()

	useOnOutsideClick(itemRef, onClose)
	return (
		<Container ref={itemRef}>
			{children}
			<div ref={menuRef}>
				<HoverIcon className="hoverIcon" iconName="More" onClick={onToggle} />
				<ContextualMenu items={menu} hidden={isHidden} target={menuRef} />
			</div>
		</Container>
	)
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Link } from '@fluentui/react'
import { memo } from 'react'
import { When } from 'react-if'

import { useExpando } from './Expando.hooks.js'
import { Container, expandoIconStyles, Toggle } from './Expando.styles.js'

export interface ExpandoProps extends React.PropsWithChildren {
	label: string
	defaultExpanded?: boolean
}

/**
 * Toggle link with a chevron and show/hide of children.
 */
export const Expando: React.FC<ExpandoProps> = memo(function Expando({
	label,
	defaultExpanded,
	children,
}) {
	const { expanded, onToggle } = useExpando(defaultExpanded)
	return (
		<Container>
			<Toggle>
				<IconButton
					styles={expandoIconStyles}
					iconProps={{
						iconName: expanded ? 'ChevronDown' : 'ChevronRight',
						styles: expandoIconStyles,
					}}
					onClick={onToggle}
				/>
				<Link onClick={onToggle}>{label}</Link>
			</Toggle>
			<When condition={expanded}>{children}</When>
		</Container>
	)
})

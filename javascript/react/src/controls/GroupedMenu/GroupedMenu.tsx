/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	IButtonStyles,
	DefaultButton,
	IContextualMenuProps,
} from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { GroupedMenuList } from './GroupedMenuList.js'

export interface GroupedMenuProps extends IContextualMenuProps {
	text?: string
}

export const GroupedMenu: React.FC<GroupedMenuProps> = memo(
	function GroupedMenu(props) {
		const { onRenderMenuList } = props
		const render = useCallback(
			(menuProps: any) => {
				if (onRenderMenuList) {
					return onRenderMenuList(menuProps)
				}
				return <GroupedMenuList {...menuProps} />
			},
			[onRenderMenuList],
		)
		const menuProps = useMemo(
			() => ({
				...props,
				onRenderMenuList: render,
			}),
			[props, render],
		)
		return (
			<DefaultButton
				styles={buttonStyles}
				text={props.text}
				menuProps={menuProps as any}
			/>
		)
	},
)

export const buttonStyles: IButtonStyles = {
	root: {
		width: 160,
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		fontWeight: 'normal',
	},
}

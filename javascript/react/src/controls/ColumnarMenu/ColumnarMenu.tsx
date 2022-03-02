/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	IButtonStyles,
	DefaultButton,
	IContextualMenuProps,
	IContextualMenuListProps,
	IRenderFunction,
} from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { ColumnarMenuList } from './ColumnarMenuList.js'

export interface ColumnarMenuProps extends IContextualMenuProps {
	text?: string
}

/**
 * Dropdown button menu that supports grouped items (using sectionProps) in a columnar layout.
 */
export const ColumnarMenu: React.FC<ColumnarMenuProps> = memo(
	function ColumnarMenu(props) {
		const { onRenderMenuList } = props
		const render: IRenderFunction<IContextualMenuListProps> = useCallback(
			menuProps => {
				if (onRenderMenuList) {
					return onRenderMenuList(menuProps)
				}
				return <ColumnarMenuList {...menuProps!} />
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
				menuProps={menuProps}
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

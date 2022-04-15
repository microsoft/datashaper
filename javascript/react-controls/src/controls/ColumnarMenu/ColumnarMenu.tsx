/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuListProps,
	IContextualMenuProps,
	IRenderFunction,
} from '@fluentui/react'
import { DefaultButton } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { dropdownButtonStyles } from '../../styles.js'
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
				styles={dropdownButtonStyles}
				text={props.text}
				menuProps={menuProps}
			/>
		)
	},
)

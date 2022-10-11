/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IRenderFunction, IRenderGroupHeaderProps } from '@fluentui/react'
import { Nav, useTheme } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useTableSelection } from './TableList.hooks.js'
import { ListContainer } from './TableList.styles.js'
import type { TableListProps } from './TableList.types.js'

export const TableList: React.FC<TableListProps> = memo(function TableList({
	inputs,
	derived,
	onSelect,
	selected,
	loading,
}) {
	const menuProps = useTableSelection(inputs, derived, selected, onSelect)
	const onRenderGroupHeader = useOnRenderGroupHeader()
	return (
		<ListContainer>
			<Nav
				{...menuProps}
				selectedKey={selected}
				onRenderGroupHeader={onRenderGroupHeader}
			/>
		</ListContainer>
	)
})

function useOnRenderGroupHeader(): IRenderFunction<IRenderGroupHeaderProps> {
	const theme = useTheme()
	return useCallback(
		props => {
			return (
				<div
					style={{
						padding: 8,
						fontWeight: 'bold',
						color: theme.palette.neutralSecondary,
						background: theme.palette.neutralLighter,
						borderTop: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
						borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
					}}
				>
					{props?.name}
				</div>
			)
		},
		[theme],
	)
}

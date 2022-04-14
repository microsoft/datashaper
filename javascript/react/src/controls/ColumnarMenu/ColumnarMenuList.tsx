/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IContextualMenuItem,
	IContextualMenuListProps,
} from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { merge } from 'lodash-es'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export const ColumnarMenuList: React.FC<IContextualMenuListProps> = memo(
	function ColumnarMenuList(props) {
		const { defaultMenuItemRenderer, items } = props
		const formatted: IContextualMenuItem[] = useMemo(() => {
			return items.map(item =>
				merge({}, item, {
					itemProps,
					sectionProps: item.sectionProps
						? {
								items: item.sectionProps.items.map(subitem =>
									merge({}, subitem, {
										itemProps,
									}),
								),
						  }
						: undefined,
				}),
			)
		}, [items])
		return (
			<MenuLayout>
				{formatted.map(item => {
					const { key } = item
					return (
						<Column key={`menu-group-${key}`}>
							<ColumnHeader>{item.sectionProps?.title as string}</ColumnHeader>
							{item.itemType === ContextualMenuItemType.Section ? (
								<>
									{item.sectionProps?.items.map(subitem =>
										defaultMenuItemRenderer(subitem as any),
									)}
								</>
							) : (
								defaultMenuItemRenderer(item as any)
							)}
						</Column>
					)
				})}
			</MenuLayout>
		)
	},
)

const itemProps = {
	styles: {
		root: {
			paddingLeft: 8,
			height: 28,
			lineHeight: 28,
		},
		item: {
			listStyleType: 'none',
		},
	},
}
const MenuLayout = styled.div`
	display: flex;
	padding: 8px 0 8px 0;
	gap: 12px;
`

const Column = styled.div`
	min-width: 120px;
`

const ColumnHeader = styled.div`
	padding: 0 12px 0 12px;
	margin-bottom: 8px;
	font-weight: bold;
	color: ${({ theme }) => theme.application().accent().hex()};
`

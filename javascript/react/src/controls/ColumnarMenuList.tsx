/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { merge } from 'lodash-es'
import { memo, useMemo } from 'react'
import type { ColumnarMenuListProps } from './ColumnarMenuList.types.js'
import {
	itemProps,
	MenuLayout,
	Column,
	ColumnHeader,
} from './ColumnarMenuList.styles.js'

export const ColumnarMenuList: React.FC<ColumnarMenuListProps> = memo(
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

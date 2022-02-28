/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuItem, SearchBox } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { searchBoxStyles } from './ItemSearchBox.styles.js'

export interface ItemSearchBoxProps {
	items: IContextualMenuItem[]
	onSearch: (results: IContextualMenuItem[]) => void
}

export const ItemSearchBox: React.FC<ItemSearchBoxProps> = memo(
	function ItemSearchBox({ items, onSearch }) {
		const onSearchAbort = useCallback(() => {
			onSearch(items)
		}, [items, onSearch])

		const onSearchChange = useCallback(
			(_ev?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
				const lower = (newValue && newValue.toLowerCase()) || ''
				const filteredItems = items.filter(
					item => item.text && item.text.toLowerCase().indexOf(lower) !== -1,
				)
				onSearch(filteredItems)
			},
			[items, onSearch],
		)

		return (
			<SearchBox
				ariaLabel="Find a verb by text"
				placeholder="Find a verb"
				onClear={onSearchAbort}
				onEscape={onSearchAbort}
				onChange={onSearchChange}
				styles={searchBoxStyles}
			/>
		)
	},
)

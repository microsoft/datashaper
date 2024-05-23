/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox } from '@fluentui/react'
import { memo } from 'react'

import { useSearch } from './ContextualMenuItemSearchBox.hooks.js'
import { searchBoxStyles } from './ContextualMenuItemSearchBox.styles.js'
import type { ContextualMenuItemSearchBoxProps } from './ContextualMenuItemSearchBox.types.js'

/**
 * Search box to filter a set of ContextualMenuItems.
 */
export const ContextualMenuItemSearchBox: React.FC<ContextualMenuItemSearchBoxProps> =
	memo(function ContextualMenuItemSearchBox({ items, onSearch }) {
		const handlers = useSearch(items, onSearch)

		return (
			<SearchBox
				ariaLabel='Find a verb by text'
				placeholder='Find a verb'
				styles={searchBoxStyles}
				{...handlers}
			/>
		)
	})

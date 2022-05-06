/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ColumnarMenu,
	ColumnarMenuList,
	ContextualMenuItemSearchBox,
} from '../controls/index.js'
import type { IContextualMenuListProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useSearchableItems, useSelectedOption } from './StepSelector.hooks.js'
import type { StepSelectorProps } from './StepSelector.types.js'
import { icons, Container, SearchContainer } from './StepSelector.styles.js'

/**
 * Creates a custom step selection dropdown.
 * If "showButton" is true, a + icon will appear next to the dropdown,
 * and onChange will only fire when it is clicked.
 */
export const StepSelector: React.FC<StepSelectorProps> = memo(
	function StepSelector({
		onCreate,
		showButton,
		verb,
		placeholder = 'Choose a verb',
	}) {
		const { text, onButtonClick, onItemClick } = useSelectedOption(
			verb,
			onCreate,
			showButton,
			placeholder,
		)

		const { items, filtered, onSearch, onSearchReset } = useSearchableItems()

		const renderMenuList = useCallback(
			(menuListProps: IContextualMenuListProps | undefined) => {
				return (
					<>
						<SearchContainer>
							<ContextualMenuItemSearchBox items={items} onSearch={onSearch} />
						</SearchContainer>
						{menuListProps ? <ColumnarMenuList {...menuListProps} /> : null}
					</>
				)
			},
			[onSearch, items],
		)

		return (
			<Container>
				<ColumnarMenu
					text={text}
					items={filtered}
					onRenderMenuList={renderMenuList}
					onItemClick={onItemClick}
					onDismiss={onSearchReset}
				/>
				{showButton && (
					<IconButton iconProps={icons.add} onClick={onButtonClick} />
				)}
			</Container>
		)
	},
)

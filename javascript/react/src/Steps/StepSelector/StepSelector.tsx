/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@data-wrangling-components/core'
import { IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { ColumnarMenu } from '../../controls/ColumnarMenu/ColumnarMenu.js'
import { ColumnarMenuList } from '../../controls/ColumnarMenu/ColumnarMenuList.js'
import { ContextualMenuItemSearchBox } from '../../controls/ContextualMenuItemSearchBox/ContextualMenuItemSearchBox.js'
import { useSearchableItems, useSelectedOption } from './StepSelector.hooks.js'

export interface StepSelectorProps {
	onCreate?: (verb: Verb) => void
	showButton?: boolean
	verb?: Verb
	placeholder?: string
}

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
			menuListProps => {
				return (
					<>
						<SearchContainer>
							<ContextualMenuItemSearchBox items={items} onSearch={onSearch} />
						</SearchContainer>
						<ColumnarMenuList {...menuListProps} />
					</>
				)
			},
			[onSearch, items],
		)

		const menuProps = {
			items: filtered,
			onRenderMenuList: renderMenuList,
			onItemClick,
			onDismiss: onSearchReset,
		}

		return (
			<Container>
				<ColumnarMenu text={text} {...menuProps} />
				{showButton && (
					<IconButton iconProps={{ iconName: 'Add' }} onClick={onButtonClick} />
				)}
			</Container>
		)
	},
)

const Container = styled.div`
	width: 240px;
	display: flex;
	align-items: center;
`

const SearchContainer = styled.div`
	border-bottom: 1px solid
		${({ theme }) => theme.application().lowContrast().hex()};
`

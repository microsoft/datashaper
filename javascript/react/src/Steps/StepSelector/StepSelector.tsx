/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@data-wrangling-components/core'
import { DefaultButton, IconButton } from '@fluentui/react'

import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { GroupedMenu } from './GroupedMenu.js'
import { ItemSearchBox } from './ItemSearchBox.js'
import {
	sortIntoGroups,
	useDropdownButtonText,
	useSelectedOption,
	useSearchableItems,
	useMenuProps,
} from './StepSelector.hooks.js'
import { buttonStylexs } from './StepSelector.styles.js'

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
		const { selected, onButtonClick, onItemClick } = useSelectedOption(
			verb,
			onCreate,
			showButton,
		)

		const { items, filtered, onSearch, onSearchReset } = useSearchableItems()

		const renderMenuList = useCallback(
			menuListProps => {
				const groups = sortIntoGroups(filtered)
				return (
					<MenuContainer>
						<SearchContainer>
							<ItemSearchBox items={items} onSearch={onSearch} />
						</SearchContainer>
						<GroupedMenu groups={groups} menuListProps={menuListProps} />
					</MenuContainer>
				)
			},
			[onSearch, items, filtered],
		)

		const menuProps = useMenuProps({
			items: filtered,
			onRenderMenuList: renderMenuList,
			onItemClick,
			onDismiss: onSearchReset,
		})

		const buttonText = useDropdownButtonText(selected, placeholder)

		return (
			<Container>
				<DefaultButton
					styles={buttonStylexs}
					text={buttonText}
					menuProps={menuProps as any}
				/>
				{showButton && (
					<IconButton iconProps={{ iconName: 'Add' }} onClick={onButtonClick} />
				)}
			</Container>
		)
	},
)

const Container = styled.div`
	width: 200px;
	display: flex;
	align-items: center;
	gap: 8px;
`

const MenuContainer = styled.div``

const SearchContainer = styled.div`
	border-bottom: 1px solid
		${({ theme }) => theme.application().lowContrast().hex()};
`

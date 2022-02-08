/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@data-wrangling-components/core'
import { Dropdown, DropdownMenuItemType, IconButton } from '@fluentui/react'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

export interface StepSelectorProps {
	onCreate?: (verb: Verb) => void
	showButton?: boolean
	verb?: string
}

export const StepSelector: React.FC<StepSelectorProps> = memo(
	function StepSelector({ onCreate, showButton, verb }) {
		const options = useGroupedOptions()
		const [currentOption, setCurrentOption] = useState<string>('aggregate')
		const handleDropdownChange = useCallback(
			(e, opt) => {
				setCurrentOption(opt.key)
				!showButton && onCreate && onCreate(opt.key)
			},
			[showButton, onCreate],
		)

		useEffect(() => {
			verb && setCurrentOption(verb)
		}, [verb])

		const handleStepClick = useCallback(() => {
			onCreate && onCreate(currentOption as Verb)
		}, [currentOption, onCreate])
		return (
			<Container>
				<Dropdown
					options={options}
					selectedKey={currentOption}
					styles={{ root: { flex: 2 } }}
					onChange={handleDropdownChange}
				/>
				{showButton && (
					<IconButton
						iconProps={{ iconName: 'Add' }}
						onClick={handleStepClick}
					/>
				)}
			</Container>
		)
	},
)

enum Compound {
	'Multi-Binarize' = 'multi-binarize',
	'Filter-Aggregate-Lookup' = 'filter-aggregate-lookup',
}

function useVerbOptions() {
	return useMemo(() => {
		return Object.entries(Verb).map(([text, key]) => ({
			key,
			text,
		}))
	}, [])
}

function useCompoundOptions() {
	return useMemo(() => {
		return Object.entries(Compound).map(([text, key]) => ({
			key,
			text,
		}))
	}, [])
}

function useGroupedOptions() {
	const verbOptions = useVerbOptions()
	const compoundOptions = useCompoundOptions()
	return useMemo(
		() => [
			{ key: 'verbs', text: 'Verbs', itemType: DropdownMenuItemType.Header },
			...verbOptions,
			{
				key: 'compounds',
				text: 'Compounds',
				itemType: DropdownMenuItemType.Header,
			},
			...compoundOptions,
		],
		[verbOptions, compoundOptions],
	)
}

const Container = styled.div`
	width: 200px;
	display: flex;
	height: 32px;
`

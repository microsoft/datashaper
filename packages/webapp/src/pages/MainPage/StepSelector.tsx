/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StepType } from '@data-wrangling-components/core'
import { Dropdown, DropdownMenuItemType, IconButton } from '@fluentui/react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

export interface StepSelectorProps {
	onCreate?: (type: StepType, subtype: string) => void
}

export const StepSelector: React.FC<StepSelectorProps> = memo(
	function StepSelector({ onCreate }) {
		const options = useGroupedOptions()
		const [currentOption, setCurrentOption] = useState<string>('verb:aggregate')
		const handleDropdownChange = useCallback((e, opt) => {
			setCurrentOption(opt.key)
		}, [])
		const handleStepClick = useCallback(() => {
			// these won't always be verbs of course
			const [type, verb] = currentOption?.split(':')
			onCreate && onCreate(type as StepType, verb)
		}, [currentOption, onCreate])
		return (
			<Container>
				<Dropdown
					options={options}
					selectedKey={currentOption}
					styles={{ root: { flex: 2 } }}
					onChange={handleDropdownChange}
				/>
				<IconButton iconProps={{ iconName: 'Add' }} onClick={handleStepClick} />
			</Container>
		)
	},
)

const VERBS = [
	'aggregate',
	'bin',
	'binarize',
	'concat',
	'dedupe',
	'derive',
	'difference',
	'fill',
	'filter',
	'fold',
	'groupby',
	'impute',
	'intersect',
	'join',
	'lookup',
	'orderby',
	'recode',
	'rename',
	'rollup',
	'sample',
	'select',
	'spread',
	'ungroup',
	'union',
	'unroll',
	'unorder',
]

const COMPOUNDS = ['binarize', 'filter-aggregate-lookup']

function useAvailableVerbs() {
	return VERBS
}

function useAvailableCompounds() {
	return COMPOUNDS
}

function useVerbOptions() {
	const verbs = useAvailableVerbs()
	return useMemo(() => {
		return verbs.map(verb => ({
			key: `verb:${verb}`,
			text: verb,
		}))
	}, [verbs])
}

function useCompoundOptions() {
	const compounds = useAvailableCompounds()
	return useMemo(() => {
		return compounds.map(verb => ({
			key: `compound:${verb}`,
			text: verb,
		}))
	}, [compounds])
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
